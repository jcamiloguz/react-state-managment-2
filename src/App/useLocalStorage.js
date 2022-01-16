import React, { useReducer } from 'react';

function useLocalStorage(itemName, initialValue) {
  const [state, dispatch] = useReducer(reducer, initialState(initialValue))
  const {
    sincronizedItem,
    error,
    loading,
    item 
  }=state

// Action Creators
const onError = (error)=>{
  dispatch({type:actionTypes.error, payload:error})
}
const onSincronize = ()=>{
  dispatch({type:actionTypes.sincronize})
}
const onSucces = (parsedItem)=>{
  dispatch({type:actionTypes.succes, payload:parsedItem})
}
const onSave = (item)=>{
  dispatch({type:actionTypes.save, payload:item})
}

  React.useEffect(() => {
    setTimeout(() => {
      try {
        const localStorageItem = localStorage.getItem(itemName);
        let parsedItem;
        
        if (!localStorageItem) {
          localStorage.setItem(itemName, JSON.stringify(initialValue));
          parsedItem = initialValue;
        } else {
          parsedItem = JSON.parse(localStorageItem);
        }
        onSucces(parsedItem)
      } catch(error) {
        onError(error)
      }
    }, 3000);
  }, [sincronizedItem]);
  
  const saveItem = (newItem) => {
    try {
      const stringifiedItem = JSON.stringify(newItem);
      localStorage.setItem(itemName, stringifiedItem);
      onSave(newItem)
      // setItem(newItem);
    } catch(error) {
      onError(error)
    }
  };
  
  const sincronizeItem = () => {
    onSincronize();
  };

  return {
    item,
    saveItem,
    loading,
    error,
    sincronizeItem,
  };
}

const initialState =(initialValue)=>({
  sincronizedItem:true,
  error:false,
  loading:true,
  item:initialValue,
})

const actionTypes = {
  error:'ERROR',
  succes:'SUCCES',
  save:'SAVE',
  sincronize:'SINCRONIZE',
}

const reducerObject =(state, payload)=>({
  [actionTypes.error]:  {
    ...state,
    error:payload,
  },
  [actionTypes.succes]:  {
    ...state,
    error:false,
    loading:false,
    sincronizedItem:true,
    item:payload
  },
  [actionTypes.save]:  {
    ...state,
    item:payload
  },
  [actionTypes.sincronize]:  {
    ...state,
    loading:true,
    sincronizedItem:false,
  }
})

const reducer = (state, action)=>{
    return reducerObject(state, action.payload)[action.type] || state
}

export { useLocalStorage };
