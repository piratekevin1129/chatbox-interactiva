var i = 0
var j = 0
var k = 0

function loadAudio(data){
    var url = data.src

    var audio_fx = null
    audio_fx = document.createElement('audio')
    audio_fx.setAttribute('src',url)
    audio_fx.load()
    audio_fx.addEventListener('loadeddata',function(){
        //alert("cargo")
        data.callBack(audio_fx)
    })
    audio_fx.addEventListener('error',function(){
        data.callBack(null)
    })
}

function setIcons(){
	for(i = 0;i<iconos.length;i++){
		var d = document.createElement('div')
		d.setAttribute("onclick","enviarEmoji("+i+")")
		d.innerHTML = '<div class="emoji '+iconos[i]+'"></div>'
		getE('chatbox-emojis-row').appendChild(d)
	}
}

function setChatbox(){
	//set fecha
	setIcons()
	intro_mp3.play()
	var fecha_actual = new Date()
	getE('fecha-actual').innerHTML = fecha_actual.getUTCDate()+'/'+(fecha_actual.getUTCMonth()+1)+'/'+fecha_actual.getUTCFullYear()

	animation_start = setTimeout(function(){
		clearTimeout(animation_start)
		animation_start = null

		pregunta_nombre = true
		unblockChat()
		setMessage({msg:'<p>¿Cuál es tu nombre? <span class="emoji smiling-face"></span></p>',extra:'',profile:'bot'})

		getE('chatbox-input').focus()
	},1000)
}

blockChat()

var animacion_typing = null
var typing = false
function setMessage(data){
	blockChat()
	var delay = 1000
	if(data.delay!=null&&data.delay!=undefined){
		delay = data.delay
	}
	getE('chatbox-typing').className = 'chatbox-typing-on'
	typing = true
	animacion_typing = setTimeout(function(){
		clearTimeout(animacion_typing)
		animacion_typing = null
		getE('chatbox-typing').className = 'chatbox-typing-off'

		sonido_mp3.play()
		typing = false
		div.classList.remove('chatbox-message-bot-off')
		div.classList.add('chatbox-message-bot-on')

		if(div2!=null){
			div2.classList.remove('chatbox-message-extra-off')
			div2.classList.add('chatbox-message-extra-on')
		}
		var chat = getE('chatbox-wraper')
   		chat.scrollTop = chat.scrollHeight - chat.clientHeight;
		unblockChat()

		if(data.callBack!=null&&data.callBack!=undefined){
			data.callBack()
		}
	},delay)

	var div = document.createElement('div')
	div.className = 'chatbox-message-bot chatbox-message-bot-off'
	var h = '<div class="msg-profile-picture"></div>'
	h+='<div class="msg-message">'
    h+=data.msg
    h+='</div>'
	div.innerHTML = h
	getE('chatbox-messages').appendChild(div)

	var div2 = null
	if(data.extra!=''){
		div2 = document.createElement('div')
		div2.className = 'chatbox-message-extra chatbox-message-extra-off'
		div2.innerHTML = data.extra
		getE('chatbox-messages').appendChild(div2)
	}
}

var animacion_sending = null
function setMessage2(data){
	blockChat()
	var div = document.createElement('div')
	div.className = 'chatbox-message-user chatbox-message-user-off'
	var h = '<div class="msg-message msg-message-recibido">'
    h+=data.msg
    h+='</div>'
    h+='<div class="msg-profile-picture"></div>'
	div.innerHTML = h
	getE('chatbox-messages').appendChild(div)

	animacion_sending = setTimeout(function(){
		clearTimeout(animacion_sending)
		animacion_sending = null
		
		sonido2_mp3.play()
		div.classList.remove('chatbox-message-user-off')
		div.classList.add('chatbox-message-user-on')

		unblockChat()
		var chat = getE('chatbox-wraper')
   		chat.scrollTop = chat.scrollHeight - chat.clientHeight;
		data.callBack()
	},50)
}

function blockChat(){
	getE('chatbox-input').classList.add('chatbox-input-locked')
	getE('chatbox-input').disabled = true
}
function unblockChat(){
	getE('chatbox-input').classList.remove('chatbox-input-locked')
	getE('chatbox-input').disabled = false
}

function handleInput(event,input){
	if(event.keyCode==13&&input.value!=""){
		var msg = saniticeValue(input.value)
		input.value = ""
		sendMensaje(msg)
		event.preventDefault();
	}
}
function clickEnviar(){
	var input = getE('chatbox-input')
	if(input.value!=""){
		var msg = saniticeValue(input.value)
		input.value = ""
		sendMensaje(msg)
	}
}

function enviarEmoji(emo){
	setMessage2({msg:'<p><span class="emoji '+iconos[emo]+'"></span></p>',callBack:function(){}})
	clickEmojis()
}

var nombre =  ""
var pregunta_nombre = false
var temas_camila = [
	{
		visto:false,
		tema:'Riesgos del mal uso de las figuras de contratación: contrato realidad',
		subtemas:[],
		respuesta:'<p>Riesgos del mal uso de las figuras de contratación: contrato realidad</p><br /><ul><li>En la Empresa de Servicios Temporales el riesgo de declaración de Contrato-realidad se configura principalmente cuando se supera el término máximo de la contratación.</li><li>Si no se cumple con todas las características del Outsourcing, puede existir riesgo de declaración de contrato realidad desde que inició el trabajador a prestar los servicios, esto es, que se declare que CEO fue siempre su empleador real.</li></ul>'
	},
	{
		visto:false,
		tema:'¿Qué es un contrato de realidad?',
		subtemas:[
			{
				visto:false,
				tema:'¿En qué consiste?',
				subtemas:[],
				respuesta:'<p>En materia laboral prima la realidad sobre las formas, por lo que independiente del contrato escrito, si en la práctica hay presencia de los elementos antes indicados, se podría considerar que existe un contrato realidad.</p>'
			},
			{
				visto:false,
				tema:'Características',
				subtemas:[],
				respuesta:'<ul><li>Riesgo de demanda, solicitando que se declare que el verdadero empleador es la empresa usuaria (CEO)</li><li>Se ordena pago de todas las obligaciones propias del contrato de trabajo – beneficios extralegales</li><li>Riesgo de multa por parte del Ministerio del Trabajo.</li></ul>'
			}
		],
		respuesta:'<p>¿Qué es un contrato de realidad?</p>'
	}/*,
	{
		visto:false,
		tema:'Tema 3',
		subtemas:[],
		respuesta:'<p>Respuesta tema 3</p>'
	}*/
]

function sendMensaje(msg){
	if(pregunta_nombre){
		pregunta_nombre = false
		nombre = msg
		setMessage2({msg:'<p>'+msg+'</p>',callBack:function(){
			var extra = ''
			extra+='<div class="extra-content">'
				for(i = 0;i<temas_camila.length;i++){
					extra+='<button onclick="cickTema('+"'tema',"+i+')">'+temas_camila[i].tema+'</button>'
				}
			extra+='</div>'
			setMessage({msg:'<p>Hola <span>'+nombre+'</span>, soy Camila, tu asesora automatizada, te puedo ayudar con:</p>',extra:extra})
		}})		
	}else{
		setMessage2({msg:'<p>'+msg+'</p>',callBack:function(){
			setMessage({msg:'<p>No entiendo lo que quieres decir <span class="emoji expressionless"></span>, por favor haz clic en una de las opciones disponibles</p>',extra:''})
		}})
	}
}

function cickTema(tipo,ind,sub,ite){
	if(!typing){
		var h = ''
		var e = ''
		var e2 = ''
		var vistos = 0

		if(tipo=='tema'){
			//click en el tema
			setMessage2({msg:'<p>'+temas_camila[ind].tema+'</p>',callBack:function(){}})
			
			h+=temas_camila[ind].respuesta

			if(temas_camila[ind].subtemas.length>0){
				//lista de subtemas
				vistos = 0
				e+='<div class="extra-content">'
				for(i = 0;i<temas_camila[ind].subtemas.length;i++){
					if(!temas_camila[ind].subtemas[i].visto){
						vistos++
						e+='<button onclick="cickTema('+"'subtema',"+ind+','+i+')">'+temas_camila[ind].subtemas[i].tema+'</button>'
					}
				}
				e+='</div>'
				if(vistos==0){
					e = ''
				}
				setMessage({msg:h,extra:e})
			}else{
				setMessage({msg:h,extra:e,callBack:function(){
					//lista de temas
					vistos = 0
					e2+='<div class="extra-content">'
					for(i = 0;i<temas_camila.length;i++){
						if(!temas_camila[i].visto){
							vistos++
							e2+='<button onclick="cickTema('+"'tema',"+i+')">'+temas_camila[i].tema+'</button>'	
						}
					}
					e2+='</div>'
					if(vistos==0){
						e2 = ''
						//es el final de todo
						e2+='<p>Ahora <span>'+nombre+'</span> te invitamos a continuar con el curso y no dudes en preguntar cuando nos volvamos a ver, ¡buen día!</p>'
						e2+='<br />'
						e2+='<button id="boton-continuar">Siguiente</button>'
					}
					setMessage({msg:'<p>Gracias por tu consulta, ¿Te puedo ayudar en algo más? <span class="emoji thinking"></span></p>',extra:e2,delay:100})
				}})
			}
			temas_camila[ind].visto = true
		}else if(tipo=='subtema'){
			//click en un subtema
			setMessage2({msg:'<p>'+temas_camila[ind].subtemas[sub].tema+'</p>',callBack:function(){}})

			h+=temas_camila[ind].subtemas[sub].respuesta

			if(temas_camila[ind].subtemas[sub].subtemas.length>0){
				//lista de subitems (por cierto no hay)
				vistos = 0
				e+='<div class="extra-content">'
				for(i = 0;i<temas_camila[ind].subtemas.length;i++){
					if(!temas_camila[ind].subtemas[i].visto){
						vistos++
						e+='<button onclick="cickTema('+"'subitem',"+ind+','+sub+','+i+')">'+temas_camila[ind].subtemas[sub].subtemas[i].tema+'</button>'
					}
				}
				e+='</div>'
				if(vistos==0){
					e = ''
				}
				setMessage({msg:h,extra:e})
			}else{
				setMessage({msg:h,extra:e,callBack:function(){
					//lista de subtemas
					e2 = ''
					vistos = 0
					e2+='<div class="extra-content">'
					for(i = 0;i<temas_camila[ind].subtemas.length;i++){
						if(!temas_camila[ind].subtemas[i].visto){
							vistos++
							e2+='<button onclick="cickTema('+"'subtema',"+ind+','+i+')">'+temas_camila[ind].subtemas[i].tema+'</button>'
						}
					}
					e2+='</div>'
					if(vistos==0){
						e2 = ''
						//si ya no hay mas subtemas, mirar si hay temas

						vistos = 0
						e2+='<div class="extra-content">'
						for(i = 0;i<temas_camila.length;i++){
							if(!temas_camila[i].visto){
								vistos++
								e2+='<button onclick="cickTema('+"'tema',"+i+')">'+temas_camila[i].tema+'</button>'	
							}
						}
						e2+='</div>'
						if(vistos==0){
							e2 = ''

							//es el final de todo
							e2+='<p>Ahora <span>'+nombre+'</span> te invitamos a continuar con el curso y no dudes en preguntar cuando nos volvamos a ver, ¡buen día!</p>'
							e2+='<br />'
							e2+='<button id="boton-continuar">Siguiente</button>'
						}
					}
					setMessage({msg:'<p>Gracias por tu consulta, ¿Te puedo ayudar en algo más? <span class="emoji thinking"></span></p>',extra:e2,delay:100})
				}})
			}
			temas_camila[ind].subtemas[sub].visto = true
		}
	}
}

function clickEmojis(){
	if(!typing){
		var wrap = getE('chatbox-emojis-content')
		var clase = wrap.className
		if(clase.indexOf('off')!=-1){
			//abrir
			wrap.className = 'chatbox-emojis-content-on'
		}else{
			//cerrar
			wrap.className = 'chatbox-emojis-content-off'
		}
	}
		
}

function saniticeValue(text){
	var texto = text.replace(new RegExp("'","g"),"")
	var texto1 = texto.replace(new RegExp('"',"g"),"")
	var texto2 = texto1.replace(new RegExp('<',"g"),"")
	var texto3 = texto2.replace(new RegExp('>',"g"),"")
	//var texto4 = texto3.replace(new RegExp("\\","g"),"")
	//return texto3
	return text
}

function getE(idname){
	return document.getElementById(idname)
}
