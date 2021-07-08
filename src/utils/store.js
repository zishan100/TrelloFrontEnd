import axios from 'axios';

export const fetchData = async () => {
       
           

  try {
    let response = await axios.get(`http://localhost:5000/getlist/`);
             
    let { data: { result } } = response;
    
    
    
    console.log(result);
       let  data= {
         lists: {
           'Todo': {
           id: 'Todo',
           title: 'Todo',
           cards:[]
          },
           'progress': {
           id: 'progress',
           title: 'progress',
           cards:[]
          },
          'Done': {
           id: 'Done',
           title: 'Done',
           cards:[]
          } 
       },
       listIds:['Todo','progress','Done']  
      }  
       
        result.forEach(res => {
          console.log(data.lists[res.status].title);
          if(res.status === data.lists[res.status].title) {
            data.lists[res.status].cards.push(res);
          }
               
        });
     
     console.log(data);
                       
      
    return data;

   }catch (error) {
        console.log('Error Occured', error); 
       
     } 
}

 
  
 

export const store = {
  lists: {
    'Todo': {
      id: 'Todo',
      title: 'Todo',
      cards:[]
    },
    'progress': {
      id: 'progress',
      title: 'progress',
      cards: []
    },
    'Done': {
      id: 'Done',
      title: 'Done',
      cards: []
    }
           
  },
  listIds: ['Todo','progress','Done']
};


