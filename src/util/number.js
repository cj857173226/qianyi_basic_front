const arr = ['pages','total','size']

export function numberFilter(data){
  if(data.data){
    for(let key in data.data){
      arr.forEach(item =>{
        if(key === item && data.data[key]){
          data.data[key] = parseInt(data.data[key])
        }
      })
    }
  }
  return data
}