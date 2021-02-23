import { randomString } from 'evian';

const SCHEMA_TYPE = [
  'string',
  'number',
  'array',
  'object',
  'boolean',
  'integer',
];
const JSONPATH_JOIN_CHAR = '.';

const defaultSchema: any = {
  string: {
    type: 'string',
  },
  number: {
    type: 'number',
  },
  array: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
  object: {
    type: 'object',
    properties: {},
  },
  boolean: {
    type: 'boolean',
  },
  integer: {
    type: 'integer',
  },
};

const getParentKeys = function(keys: string[]) {
  if (keys.length === 1) return [];
  let arr = [...keys];
  arr.splice(keys.length - 1, 1);
  return arr;
};

function getData(state: any, keys: string[]) {
  let curState = state;
  for (let i = 0; i < keys.length; i++) {
    curState = curState[keys[i]];
  }
  return curState;
}

function setData(state: any, keys: string[], value: any) {
  let curState = state;
  for (let i = 0; i < keys.length - 1; i++) {
    curState = curState[keys[i]];
  }
  curState[keys[keys.length - 1]] = value;
  return curState;
}

function deleteData(state: any, keys: string[]) {
  let curState = state;
  for (let i = 0; i < keys.length - 1; i++) {
    curState = curState[keys[i]];
  }

  delete curState[keys[keys.length - 1]];
}

function getFieldstitle(data: any) {
  const requiredtitle: any[] = [];
  Object.keys(data).forEach(title => {
    requiredtitle.push(title);
  });

  return requiredtitle;
}

function handleSchemaRequired(schema: any, checked: boolean) {
  console.log(schema);
  if (schema.type === 'object') {
    let requiredtitle = getFieldstitle(schema.properties);
    if (checked) {
      schema.required = [...requiredtitle];
    } else {
      delete schema.required;
    }

    handleObject(schema.properties, checked);
  } else if (schema.type === 'array') {
    handleSchemaRequired(schema.items, checked);
  } else {
    return schema;
  }
}

function handleObject(properties: any, checked: boolean) {
  for (var key in properties) {
    if (properties[key].type === 'array' || properties[key].type === 'object')
      handleSchemaRequired(properties[key], checked);
  }
}

function requireAllAction(state: any, required: boolean) {
  // let oldData = oldState.data;
  handleSchemaRequired(state, required);
  return state;
}

// 增加子节点
const addChildFieldAction = (state: any, keys: string[]) => {
  console.log('addChildFieldAction');
  let oldData = state.data;
  let propertiesData = getData(oldData, keys);
  let newPropertiesData: any = {};

  newPropertiesData = Object.assign({}, propertiesData);
  let ranName = 'field_' + randomString(8);
  newPropertiesData[ranName] = defaultSchema.string;
  setData(state.data, keys, newPropertiesData);

  // add required
  let parentKeys = getParentKeys(keys);
  let parentData = getData(oldData, parentKeys);
  let requiredData: string[] = [].concat(parentData.required || []);
  requiredData.push(ranName);
  parentKeys.push('required');
  setData(state.data, parentKeys, requiredData);
  return state.data;
};

// 增加同级节点
function addFieldAction(state: any, keys: string[], name: string) {
  let oldData = state.data;
  let propertiesData = getData(oldData, keys);
  let newPropertiesData: any = {};

  let parentKeys = getParentKeys(keys);
  let parentData = getData(oldData, parentKeys);
  console.log('parentData', parentData);
  let requiredData: string[] = [].concat(parentData.required || []);

  if (!name) {
    newPropertiesData = Object.assign({}, propertiesData);
    let ranName = 'field_' + randomString(8);
    newPropertiesData[ranName] = defaultSchema.string;
    requiredData.push(ranName);
  } else {
    console.log('else', propertiesData, name);
    for (let i in propertiesData) {
      newPropertiesData[i] = propertiesData[i];
      if (i === name) {
        let ranName = 'field_' + randomString(8);
        console.log(
          'name ok',
          ranName,
          newPropertiesData,
          newPropertiesData[ranName],
        );
        newPropertiesData[ranName] = defaultSchema.string;
        requiredData.push(ranName);
      }
    }
  }
  setData(state.data, keys, newPropertiesData);
  // 默认必填
  parentKeys.push('required');
  setData(state.data, parentKeys, requiredData);
  return state.data;
}

// 删除节点
function deleteItemAction(state: any, keys: string[]) {
  let name = keys[keys.length - 1];
  let oldData = state.data;
  let parentKeys = getParentKeys(keys);
  let parentData = getData(oldData, parentKeys);
  let newParentData: any = {};
  for (let i in parentData) {
    if (i !== name) {
      newParentData[i] = parentData[i];
    }
  }
  setData(state.data, parentKeys, newParentData);
  return state.data;
}

function changeValueAction(state: any, keys: string[], value: any) {
  if (value) {
    setData(state.data, keys, value);
  } else {
    deleteData(state.data, keys);
  }
  return state.data;
}

interface ActionItem {
  keys: string[];
  name: string;
  required: boolean;
}

// 处理必须
function enableRequireAction(state: any, action: ActionItem) {
  const { keys, name, required } = action;
  let parentKeys = getParentKeys(keys);
  let oldData = state.data;
  let parentData = getData(oldData, parentKeys);
  let requiredData: string[] = [].concat(parentData.required || []);
  let index = requiredData.indexOf(name);

  if (!required && index >= 0) {
    requiredData.splice(index, 1);
    parentKeys.push('required');
    if (requiredData.length === 0) {
      deleteData(state.data, parentKeys);
    } else {
      setData(state.data, parentKeys, requiredData);
    }
  } else if (required && index === -1) {
    requiredData.push(name);
    parentKeys.push('required');
    setData(state.data, parentKeys, requiredData);
  }

  return state.data;
}

export {
  defaultSchema,
  SCHEMA_TYPE,
  JSONPATH_JOIN_CHAR,
  getParentKeys,
  getData,
  setData,
  deleteData,
  requireAllAction,
  addChildFieldAction,
  addFieldAction,
  deleteItemAction,
  enableRequireAction,
  changeValueAction,
};
