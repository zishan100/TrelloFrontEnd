import axios from 'axios';

export const fetchData = async () => {
      
    try {
     let response=await axios.get(`http://localhost:5000/getlist/`)
               
      let { data:{result}} = response;
        
      return {
         lists: {
           'list-1': {
           id: 'list-1',
           title: 'Todo',
           cards:result
          },
           'list-2': {
           id: 'list-2',
           title: 'progress',
           cards:[]
          },
          'list-3': {
           id: 'list-3',
           title: 'Done',
           cards:[]
          } 
           
      },
       listIds:['list-1','list-2','list-3']  
      }
    }
    catch (error) {
        console.log('Error Occured', error); 
       
     } 
}

 
  
 

export const store = {
  lists: {
    'list-1': {
      id: 'list-1',
      title: 'Todo',
      cards:[]
    },
    'list-2': {
      id: 'list-2',
      title: 'progress',
      cards: []
    },
    'list-3': {
      id: 'list-3',
      title: 'Done',
      cards: []
    }
           
  },
  listIds: ['list-1', 'list-2', 'list-3']
};


