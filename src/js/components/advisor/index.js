import React, { Component } from 'react';
import NavBar from '../navbar/';
import DropZone from './drop';
import Loading from '../shared/loading';
import SubMenu from './submenu';
import FileItem from './file_item/file_item.js';
import * as File from '../../data/file';
import * as ModalService from '../modal/modal_service';
import * as FileHelper from './file_item/file_helper';
import * as Toast from './../shared/toast/toast_service';
import InfiniteScroll from 'react-infinite-scroller';
import { indexOfObject } from '../../utils/utils';

import FileModal from './file_item/file_modal.js';

const STATUS_MODEL = { isProcessing: false, current: 0, total: 0, shouldLoad: true };

class Advisor extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      files: [],
      evaluating: false,
      isLoading: true,
      filesSaving: [],
      searchedTerm: '',
      // process pipeline activity
      status: { current: null, total: null }, 
      hasMoreItems: true
    };

    this.files = [];
    this.filteredFiles = null;
    this.categories = [];
    this.chunkSize = 5;
    this.page = 0;
    // save upload error objs. It must be zeroed after each upload session. 
    // It will tell how many file were not processed
    this.uploadErrors = [];
    // hold toasts objects
    this.toast = {};

    this.openModal = this.openModal.bind(this);
    this.filter = this.filter.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.saveFileChange = this.saveFileChange.bind(this);
    this.onFileDrop = this.onFileDrop.bind(this);
    this.attachOptionsOnFile = this.attachOptionsOnFile.bind(this);
    this.search = this.search.bind(this);
    this.setSearchTerm = this.setSearchTerm.bind(this);
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.resetPageCount = this.resetPageCount.bind(this);
    this.resetOptions = this.resetOptions.bind(this);
    this.openModalDoc = this.openModalDoc.bind(this);
    this.onFileProcesseSuccess = this.onFileProcesseSuccess.bind(this);
    this.onFileProcessError = this.onFileProcessError.bind(this);
    this.onFilePipeUpdate = this.onFilePipeUpdate.bind(this);
  }

  // File handling

  componentDidMount () {
    File.getCategories()
    .then(response => {
      this.categories = response.data;
      return File.list({ workspace: ".", status: "." });
    })
    .then(({status, data}) => {
      if (!status) {
        throw new Error('Trate a list de files, noob');
      }
    
      this.files = data.map(this.attachOptionsOnFile, this);
      this.setState({ isLoading: false });
    })
    .catch(error => {
      console.error(error);
      Toast.open('Erro ao carregar os arquivos. Tente mais tarde.', 'danger');
      this.setState({ isLoading: false });
    });
    // socket events
    File.subscribe('success', this.onFileProcesseSuccess);
    File.subscribe('error', this.onFileProcessError);
    File.subscribe('update', this.onFilePipeUpdate);
  }

  componentWillUnmount () {
    File.unsubscribe('success', this.onFileProcesseSuccess);
    File.unsubscribe('error', this.onFileProcessError);
    File.unsubscribe('update', this.onFilePipeUpdate);
  }

  attachOptionsOnFile (file) {
      console.log(file);
    if (!file.data.assunto.default_options) {
      FileHelper.initialFileSetup(file, this.categories);
    } else {
      file.data.assunto.options = this.categories.assunto.options;
      file.data.grupo_de_assunto.options = this.categories.grupo_de_assunto.options;
      file.data.area_judicial.options = this.categories.area_judicial.options;
      FileHelper.setSelectedAssunto(file, this.categories);
      FileHelper.sortGruposByAssunto(file, this.categories);
    }

    return file;
  }

  /**
   * Process received file data
   * @param {object} file - processed data from socket 'file_success' event
   */
  onFileProcesseSuccess (file) {
      let files = this.files;
      
      file.isNew = true;
      this.attachOptionsOnFile(file);
      files.unshift(file);

      console.log('onFileProcessSuccess:success', file);
      this.setState({ files });
  }

  /**
   * Treat errors received at 'file_error' socket event
   * @param {Error} error - error object containing why file wasn't processed
   */
  onFileProcessError (error) {
      console.log('onFileProcessError:error', error);
      Toast.open(error.message, 'warning');
  }

  /**
   * 
   * @param {objet} update - file process pipeline updates (how many files are been processed)
   */
  onFilePipeUpdate (update) {
    this.setState({ status: { current: update.waiting, total: update.total } });
  }

  onFileDrop (accepted, rejected) {
      if (accepted && accepted.length) {
          ModalService.dismiss();
          // updating status...
          Toast.open('Arquivo(s) enviado(s) para processamento', 'success');

          accepted.forEach(file => {
              File.process(file)
              .then(result => { console.log('onFileDrop:success ', result); })
              .catch(this.onFileProcessError);
          });
      }
  }

  handleFileChange (file, change) {
    try {
      const index = this.files.indexOf(file);
      let newValue = change.value;
      
      if (index === -1) {
        throw new Error('File not found');
      }

      // Área Judicial, Grupo de Assunto and Assuntos special rules
      if (FileHelper[change.prop]) { 
        FileHelper[change.prop](this.files[index], newValue, this.categories);
      }

      // threating selected value
      if (Array.isArray(newValue)) {
        newValue = newValue.map(v => v.value).join();
      } else if (typeof value === 'object') {
        newValue = newValue.value;
      }

      this.files[index].data[change.prop].selected = newValue;
      file.status = File.STATUS.PENDING;

      this.setState({ files: this.files }, () => {
        this.openModalDoc(this.files[index], ModalService.hasCallback());
      });
    } catch (e) {
      console.error('Error: on handleFileChange\n', e);
    }
  }

  saveFileChange (selectedFile) {
    let files = this.files;
    let filesSaving = this.state.filesSaving;
    const index = files.indexOf(selectedFile);
    let file = files[index];
    
    filesSaving[index] = true;
    this.setState({ files, filesSaving });
    let data = {};

    for (let prop in file.data) {
      if (prop !== status) {
        data[prop] = {
          options: file.data[prop].options,
          selected: file.data[prop].selected,
          raw_selected: file.data[prop].raw_selected,
          default_options: file.data[prop].default_options
        };
      }
    }

    File.update({
      _id: file._id,
      data: {
        data: data,
        status: File.STATUS.REVISED
      }
    })
    .then(response => {
      filesSaving[index] = false;

      if (file.isNew) {
        file.isNew = null;
      }

      file.status = File.STATUS.REVISED;

      this.setState({ file, filesSaving });
    })
    .catch(error => {
      console.error('Error saving file: \n', error);
      filesSaving[index] = false;
      self.setState({ filesSaving });
    });
  }

  resetOptions (file) {
    try {
      let files = this.state.files;
      let index = files.indexOf(file);

      files[index].data.assunto.options = files[index].data.assunto.default_options;
      files[index].data.assunto.default_options = null;

      FileHelper.initialFileSetup(files[index], this.categories);
      this.setState({ files });
    } catch (e) {
      console.error(e); 
      Toast.open('Erro ao resetar o arquivo. Tente mais tarde.', 'danger');
    }
  }

  openModalDoc (i, f) {
    ModalService.open(
      <FileModal categories={this.categories} item={i} onChange={(prop,value) => this.handleFileChange(i,{prop, value})} 
      onSave={this.saveFileChange} />,
    f);
  }

  downloadCsv (file) {
    let data = [];
    let blob = null;
    let link = null;
    let url = window.URL || window.webkitURL;

    File.FIELDS_SISJUR.forEach(field => {
      let formatted = field.toLowerCase().replace(/( |\/)/g, '_');
      if (file.data[formatted]) {
        data.push(file.data[formatted].selected);
      }
    });
    
    data = new Blob([data.join(';')], { type: 'text/csv;charset=utf-8' });
    link = document.createElement('a');
    link.setAttribute("href", url.createObjectURL(data));
    link.setAttribute("download", `${file.filename}.csv`);
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
    },100);
  }

  // 
  resetPageCount () {
    this.page = 0;
  }

  // Modal handling

  openModal () {
    ModalService.open(<DropZone onDrop={this.onFileDrop} />);
  }

  // File List handling
  // Todos, Pendentes e Revisados
  filter (status) {
    let files = this.files;
    
    if (status === 'all') {
      this.filteredFiles = null;
    } else {
      this.filteredFiles = files.filter(entry => entry.status === status);
    }

    this.resetPageCount();
    this.setState({ files: [] }, () => {
      setTimeout(this.loadMoreItems);
    });
  }

  setSearchTerm (event) {
    this.setState({ searchedTerm: event.target.value });
  }

  search (event) {
    if (event.key === 'Enter') {
      let term = this.state.searchedTerm;
      let files = this.files;
      let regex = new RegExp(term, 'i');
      
      this.filteredFiles = files.filter(file => {
        if (regex.test(file.filename)) {
          return true;
        }

        for (let field in file.data) {
          if (regex.test(file.data[field].selected)) {
            return true;
          }
        }
        return false;
      });

      this.resetPageCount();
      this.setState({ files: [] }, () => {
        setTimeout(this.loadMoreItems);
      });
    }
  }


  loadMoreItems (page) {
    let offset = this.page * this.chunkSize;
    let array = this.filteredFiles || this.files;
    let newItems = array.slice(offset, (offset + this.chunkSize));
    let hasMoreItems = true;

    if (newItems.length < this.chunkSize) {
      hasMoreItems = false;
    }

    this.page++;
    this.setState({ files: this.state.files.concat(newItems), hasMoreItems });
  }

  render() {
    let emptyReturnList = !this.state.isLoading && !this.state.status.isProcessing && !this.files.length;

    return (
      <div className="container advisor">
        <SubMenu 
          openModal={this.openModal} 
          filterBy={this.filter} 
          searchBy={this.setSearchTerm} 
          onSearchKeyPress={this.search}
          searchedTerm={this.state.searchedTerm} 
          status={this.state.status} />

        <div className="container file-container">
          {
            this.state.isLoading ? null :
            <InfiniteScroll
                pageStart={-1}
                loadMore={this.loadMoreItems}
                hasMore={this.state.hasMoreItems}
                useWindow={false}>
                
                { 
                  emptyReturnList ?
                  <div className="drop-container"><DropZone onDrop={this.onFileDrop} /></div> :
                  this.state.files.map((file, index) => {
                    let isSaving = this.state.filesSaving[index];
                    return (
                      <FileItem 
                        key={file._id} 
                        item={file} 
                        isSaving={isSaving} 
                        onChange={this.handleFileChange} 
                        onSave={this.saveFileChange} 
                        onResetOptions={this.resetOptions}
                        onCsvDownload={this.downloadCsv}
                        openModal={this.openModalDoc} />
                    );
                  })
                }
              
            </InfiniteScroll>
          }
        </div>
        
        { this.state.isLoading ? <Loading /> : null }
      </div>
    );
  }
}

export default Advisor;