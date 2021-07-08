import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import List from './components/List/List';
import {fetchData ,store} from './utils/store';
import StoreApi from './utils/storeApi';
import InputContainer from './components/Input/InputContainer';
import { makeStyles } from '@material-ui/core/styles';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TopBar from './components/TopBar';
import { useEffect } from 'react';
// import SideMenu from './components/SideMenu';

const useStyle = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    background: 'green',
    width: '100%',
    overflowY: 'auto',
  },
  listContainer: {
    display: 'flex',
  },
}));

export default function App () {
    
   const [data, setData] = useState(store);
  //  const [Data,Setdata] = useState([]);
  // const [open, setOpen] = useState(false);
    // console.log(store);
  
  const classes = useStyle();
  
    useEffect(() => {
         
      async function getlist () {
          let Data =await fetchData();
           setData(Data);
      }   
      getlist();
    }, []);
   
  // console.log(data);
  
   
   
   const addMoreCard = (title, listId) => {
    console.log(title, listId);
      console.log(data.lists[listId].title);   
    
    
     
     axios.post('http://localhost:5000/createtitle/', {
       title: title,
       status:data.lists[listId].title
     })
       .then(response => {
         if (response.status === 200) {
           let { data:{result}} = response;
            const newCard = {
              id:result.id,
              title,
            };
        const list = data.lists[listId];
        list.cards = [...list.cards, newCard];
        console.log(list.cards);
        const newState = {
          ...data,
          lists: {
            ...data.lists,
            [listId]: list,
          },
        };
         setData(newState);
        }
       
       })
       .catch(err => {
         console.log(err);
       })
    
    
  };

  const addMoreList = (title) => {
    const newListId = uuid();
    const newList = {
      id: newListId,
      title,
      cards: [],
    };


    const newState = {
      listIds: [...data.listIds, newListId],
      lists: {
        ...data.lists,
        [newListId]: newList,
      },
    };
    setData(newState);
  };

  const updateListTitle = (title, listId) => {
    console.log(title, listId);
    const list = data.lists[listId];
    list.title = title;

    const newState = {
      ...data,
      lists: {
        ...data.lists,
        [listId]: list,
      },
    };
    setData(newState);
  };

  const onDragEnd = (result) => {
    
    const { destination, source, draggableId, type } = result;
         
    
    console.log('destination', destination, 'source', source, draggableId);
    if(!destination) {
      return;
    }
    if (type === 'list') {
      const newListIds = data.listIds;
      newListIds.splice(source.index, 1);
      newListIds.splice(destination.index, 0, draggableId);
      return;
    }
  
    const sourceList = data.lists[source.droppableId];
    const destinationList = data.lists[destination.droppableId];
    const draggingCard = sourceList.cards.filter(
      (card) => card.id === draggableId
    )[0];

    if (source.droppableId === destination.droppableId) {
      sourceList.cards.splice(source.index, 1);
      destinationList.cards.splice(destination.index, 0, draggingCard);
      const newSate = {
        ...data,
        lists: {
          ...data.lists,
          [sourceList.id]: destinationList,
        },
      };
      setData(newSate);
    } else {
      sourceList.cards.splice(source.index, 1);
      destinationList.cards.splice(destination.index, 0, draggingCard);

      const newState = {
        ...data,
        lists: {
          ...data.lists,
          [sourceList.id]: sourceList,
          [destinationList.id]: destinationList,
        },
      };
      setData(newState); 
     
    axios.post('http://localhost:5000/updatingStatus/', {
       id:draggableId.toString(),
       status:destination.droppableId
     }).then(response => {
           
       console.log(response);
      
     }).catch(err => {
       console.log(err);
    })
    }
  
  };
   
  return (
    <StoreApi.Provider value={{ addMoreCard,addMoreList, updateListTitle }}>
      <div
        className={classes.root}
        style={{
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <TopBar />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="app" type="list" direction="horizontal">
            {(provided) => (
              <div
                className={classes.listContainer}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                
                {data.listIds.map((listId, index) => {
                  const list = data.lists[listId];
                  return <List list={list} key={listId} index={index} />;
                }) }
                
                <InputContainer type="list" />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
      </div>
    </StoreApi.Provider>
  );
}
