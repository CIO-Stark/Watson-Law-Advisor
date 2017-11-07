import { indexOfObject, clone } from '../../../utils/utils';

// let categories = null;
const PercRegExp = /\([0-9]{1,3}%\)$/;

function setAssuntoRawValues (file, assuntos, categories) {
  let selected = file.data.assunto.selected.split(',');
  file.data.assunto.raw_selected = [];
  
  categories.assunto.options.forEach(option => {
    if (selected.indexOf(option.value) > -1) {
      file.data.assunto.raw_selected.push(option);
    }
  });
}

function setGrupoRawValue (file, categories) {
  if (typeof file.data.grupo_de_assunto.selected === 'string') {
    const selected = file.data.grupo_de_assunto.selected;
  
    categories.grupo_de_assunto.options.some(option => {
      if (option.value === selected) {
        file.data.grupo_de_assunto.raw_selected = option;
        return true;
      }
    });  
  } else {
    file.data.grupo_de_assunto.raw_selected = file.data.grupo_de_assunto.selected;
  }
}

function setAssuntosOptions (file, grupoId, categories) {
  const watsonOptions = file.data.assunto.raw_selected.filter(o => PercRegExp.test(o.value));
  let newOptions = [];
  
  categories.assunto.options.forEach(option => {
    if (option.groups_id.indexOf(grupoId) > -1) {
        if (watsonOptions.length) {
            let label = null;
            let match = null;
            
            watsonOptions.some(wOpt => {
                let itbe = wOpt.label.replace(PercRegExp, '').trim();
                label = wOpt.label;
                return match = itbe.match(new RegExp(option.label));
            });

            if (match) {
                let formattedOpt = option; 
                formattedOpt.label = formattedOpt.value = label;
                newOptions.push(formattedOpt);
            } else {
                newOptions.push(option);
            }

        } else {
            newOptions.push(option);
        }
    }
  });
  
  file.data.assunto.options = newOptions;
}

/**
 * Setup and save raws values and watson's response on separated objects
 * @param  {object} file - updated file
 * @param  {object} fieldsCategories
 */
function initialFileSetup (file, fieldsCategories) {
  let categories = clone(fieldsCategories);

  if (!file.data.assunto.default_options) {
    let assuntoOptions = file.data.assunto.options.map(attachPercToAssunto);
    // Hold watson response in a new object
    file.data.assunto.default_options = assuntoOptions;
    // Hold selected objects for a faster search
    file.data.assunto.raw_selected = assuntoOptions;
    // same for grupo
    file.data.grupo_de_assunto.default_options = file.data.grupo_de_assunto.options[0];
    file.data.grupo_de_assunto.raw_selected = file.data.grupo_de_assunto.options[0];
    file.data.grupo_de_assunto.options = categories.grupo_de_assunto.options;
    sortGruposByAssunto(file);
  } else {
    setAssuntoRawValues(file, categories);
    file.data.grupo_de_assunto.options = categories.grupo_de_assunto.options;
    // sort grupos based on assuntos and only show assuntos related to the selected grupo
    sortGruposByAssunto(file);
    // Hold selected objects for a faster search
    setGrupoRawValue(file, categories);
  }

  // placing categories options
  file.data.assunto.options = categories.assunto.options;
  file.data.area_judicial.options = categories.area_judicial.options;

  setAssuntos(file, file.data.grupo_de_assunto.raw_selected);
  setAssuntosOptions(file, file.data.grupo_de_assunto.raw_selected.id, categories);
  setAreaJudicial(file, file.data.grupo_de_assunto.raw_selected);
  
  return file;
}

/**
 * Check assuntos' groups and put them in the beginning of the group options array.
 * Assunto's raw_selected is required to sort groups
 * @param  {object} file - updated file
 */
function sortGruposByAssunto (file) {
  let index = 0;
  let assuntos = file.data.assunto.raw_selected;
  let grupos = file.data.grupo_de_assunto.options;
  // each item here will be { id, count }
  let gruposIds = [];

  assuntos.forEach(assunto => {
    assunto.groups_id.forEach(id => {
      let index = indexOfObject(gruposIds, 'id', id);

      if (index === -1) {
        gruposIds.push({ id: id, count: 1 });
      } else {
        gruposIds[index].count++;
      }
    });
  });

  gruposIds.sort((a,b) => {
    return a.count < b.count ? 1 : -1;
  });

  gruposIds.forEach(grupo => {
    let position = indexOfObject(grupos, 'id', grupo.id);
    
    grupos.splice(index, 0, grupos.splice(position, 1)[0]);
    index++;
  });

  // console.log(grupos);
  // file.data.grupo_de_assunto.options = grupos;
}

/**
 * Set área judicial based on the given group
 * @param  {object} file - updated file
 * @param  {object} group
 */
function setAreaJudicial (file, group) {
  try {
    let index = indexOfObject(file.data.area_judicial.options, 'id_area', group.id_area);
    file.data.area_judicial.selected = file.data.area_judicial.options[index].value;
  } catch (e) {
    console.error('Error setting area judicial. Grupo id might not exist');
  }
}

/**
 * Set assuntos based on the given group
 * @param  {object} file - updated file
 * @param  {object} group
 */
function setAssuntos (file, group) {
  let newAssuntos = [];
  let assuntos = file.data.assunto.default_options.concat(file.data.assunto.raw_selected || []);
  group.id = parseInt(group.id);
  
  assuntos.forEach(option => {
    if (indexOfObject(newAssuntos, 'id', option.id) === -1 && option.groups_id.indexOf(group.id) > -1) {
      newAssuntos.push(option);
    }
  });
  
  file.data.assunto.raw_selected = newAssuntos;
  file.data.assunto.selected = newAssuntos.map(assunto => assunto.value).join();
}

/**
 * Calls when user selected an área. Reset other fields selected options
 * @param  {object} file - updated file
 */
function area_judicial (file) {
  file.data.assunto.selected = undefined;
  file.data.assunto.raw_selected = undefined;
  file.data.grupo_de_assunto.selected = undefined;
  file.data.grupo_de_assunto.raw_selected = undefined;
}

/**
 * Calls when user selected an grupo. Updates area and assuntos based on the selected group
 * @param  {object} file - updated file
 * @param  {object} selectedItem
 */
function grupo_de_assunto (file, selectedItem, categories) {
  // update area_judicial
  setAreaJudicial(file, selectedItem);
  // update assuntos
  setAssuntos(file, selectedItem);
  setAssuntosOptions(file, selectedItem.id, categories);
}

/**
 * Calls when user selected an grupo. Update groups options based on the selected assuntos
 * @param  {object} file - updated file
 * @param  {array} values - selected assuntos
 */
function assunto (file, values, categories) {
  file.data.assunto.raw_selected = values;
  sortGruposByAssunto(file);
}

function attachPercToAssunto (assunto) {
    if (!PercRegExp.test(assunto.label)) {
        const number = assunto.tfNormalized >= 1 ? 0.99 : assunto.tfNormalized; //@TODO -> remove golden manchete
        const perc = (number * 100).toFixed();
        assunto.label = `${assunto.label} (${perc}%)`;
        assunto.value = `${assunto.value} (${perc}%)`;
    }

    return assunto;
}

function setSelectedAssunto (file, categories) {
    setAssuntos(file, file.data.grupo_de_assunto.raw_selected);
    setAssuntosOptions(file, file.data.grupo_de_assunto.raw_selected.id, clone(categories));
}

export { initialFileSetup, sortGruposByAssunto, area_judicial, grupo_de_assunto, assunto, setSelectedAssunto };