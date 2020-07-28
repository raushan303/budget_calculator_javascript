var data;
console.log('Hello')
document.querySelector('.add__btn').addEventListener('click', function(){
   
    data={ 
    type : document.querySelector('.add__type').value,
    description:document.querySelector('.add__description').value,
    value:document.querySelector('.add__value').value
   };
    console.log(data.type);
    console.log(data.description);
    console.log(data.value);
    //var para=jQuery,param
    fetch('http://localhost:3000/ok?'+'raushan='+JSON.stringify(data)).then((response) => {
        response.json().then((data) => {
            console.log(data);
        })
    })
   
});