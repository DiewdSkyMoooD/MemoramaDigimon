const d = document;
let $cards=d.getElementById('cards'),
$cronometro=d.getElementById('cronometro'),
$besttime=d.getElementById('BestTime'),
cards=[], 
seg=0,min=0,
crono,
completados=0,
allcards=[],
$fragment=d.createDocumentFragment(),
$iniciar=d.getElementById('iniciar'),
par={
    firstcard:null ,
    secondcard:null,
    images:{firstimg:null,secondimg:null},
} 

d.addEventListener('DOMContentLoaded',BestTime)

$iniciar.addEventListener('click',()=>{
    cards=[]
    completados=0;
    seg=0,min=0;
    $cronometro.innerHTML='00:00';
    fetch('https://digimon-api.vercel.app/api/digimon')
    .then(res=>res.json())
    .then((json)=>{
        for (let i=0;i<12;i++){
            let random=Math.floor(Math.random()*208)
            cards.push(json[random])
        }
        allcards=[...cards, ...cards];
        allcards.sort(()=>Math.random()-0.5)
        render(allcards);
        startcronometro();
        $iniciar.disabled=true;
    })
    .catch(err=>console.log(err))
})

function render(array){
    $cards.innerHTML='';
    array.forEach(el => {
        let $img=d.createElement('img');
        let $card=d.createElement('div');
        $card.classList.add('card')
        $card.onclick=voltear;
        $img.setAttribute('src',el.img);
        $img.classList.add( 'img-fluid')
        $card.appendChild($img)
        $fragment.appendChild($card) 
    });
    $cards.appendChild($fragment)
}

function voltear(e){
    e.target.children[0].classList.add('visible')
    pares(e.target.children[0])
}

function pares(img){
    if(par.firstcard===null){
        par.firstcard=img.src;
        par.images.firstimg=img;
    }else{
        par.secondcard=img.src
        par.images.secondimg=img
        if(par.firstcard===par.secondcard){
            par.firstcard=null
            par.secondcard=null
            par.images.firstimg=null
            par.images.secondimg=null
            completados+=1;
            if(completados===12){
                stopcronometro(crono);
                alert("finalizado", $cronometro);
                savetime($cronometro.innerHTML);
                $iniciar.disabled=false;
                BestTime();
            }
        }else{
            $cards.classList.add('inmutable')
            setTimeout(()=>{
                $cards.classList.remove('inmutable')
                par.firstcard=null
                par.secondcard=null
                par.images.firstimg.classList.remove("visible");
                par.images.secondimg.classList.remove("visible");
            },800) 
        }
    }
}

function startcronometro(){
    crono=setInterval(()=>{
        seg=seg+1;

        if(seg>=60){
            min=min+1;
            seg=0;
        }
        $cronometro.innerHTML=min+":"+seg;
        
    },1000)
}

function stopcronometro(crono){
    clearInterval(crono)
}

function savetime(time){
    if(localStorage.getItem('BestTime')){
        if(time<localStorage.getItem('BestTime')){
            localStorage.setItem('BestTime',time)  
          }
    }else{
        localStorage.setItem('BestTime',time)
    }
}

function BestTime(){
    if(localStorage.getItem('BestTime')){
        $besttime.innerHTML="BestTime: "+localStorage.getItem('BestTime');
    }else{
        $besttime.innerHTML="BestTime: 00:00"
    }
}
