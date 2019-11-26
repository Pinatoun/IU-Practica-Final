function getCookie(value){
  var name = value + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(name, value){
  document.cookie = name+"="+value;
}

function submitRegister(subButon) {
  var result = $(subButon).find("input");
  var array = result.map(function() {
    return $(this);
  }).get();

    if (subButon == "#regForm") {
      //TODO: validar con cada uno de los emails
      if(decodeURIComponent(document.cookie).replace(/;/g, '').replace(/ /g, '').split(":").includes($(subButon+" input[name='email']").val())){
        alert("Esa cuenta de e-mail ya está en uso.");
        return;
      }
      if(decodeURIComponent(document.cookie).replace(/;/g, '').replace(/ /g, '').split(":").includes($(subButon+" input[name='username']").val())){
        alert("Ese nombre de usuario ya está en uso.");
        return;
      }
    }
    if (subButon == "#regForm" || subButon == "#profileForm") {
      if (!$(subButon+" input[name='password']").val().match("[a-z0-9]+$")) {
        alert("La contraseña contiene caracteres distintos a letras minúsculas o números");
        return;
      }
      if ($(subButon+" input[name='password']").val().length > 8){
        alert("La contraseña debe tener como máximo 8 caracteres");
        return;
      }
      if (!$(subButon+" input[name='email']").val().match("\\w+@\\w+\\.\\w+$")){
        alert("El formato del email no es el correcto (nombre@dominio.extensión)");
        return;
      }
  }
  var email = $(subButon+" input[name='email']").val();
  var username = $(subButon+" input[name='username']").val();
  var password = $(subButon+" input[name='password']").val();
  for (var i = 0; i < array.length; i++) {
    if (array[i].attr("type")=="checkbox") {
        setCookie(email+":"+username+":"+array[i].attr("name"), array[i].prop("checked"));
    }else if (array[i].attr("name") != undefined){
        setCookie(email+":"+username+":"+array[i].attr("name"), array[i].val());
    }
  }
  if (subButon == "#regForm" ) {
    $("#startSesion").click();
  }
  if (subButon == "#profileForm") {
    //TODO: Hacerlo con el nuevo estilo de cookies
    $(".user h3").text($(subButon+" input[name='username']").val());
    alert("Se han actualizado los datos del perfil");
  }
}

function clearForm() {
  $(":input").not(":submit").val("");
  $(':checkbox').each(function(){ //iterate all listed checkbox items
		this.checked = false; //change ".checkbox" checked status
	});
}

function logIn() {
  //TODO: Hacerlo con las nuevas cookies
  /*if (!$("input[name='emailLogIn']").val().match("\\w+@\\w+\\.\\w+$")){
    alert("El formato del email no es el correcto (nombre@dominio.extensión)");
    return;
  }*/
  if (validateLogIn()/*($("input[name='emailLogIn']").val() == email || $("input[name='emailLogIn']").val() == username) && $("input[name='passwordLogIn']").val() == password*/) {
    loadLogIn(getCookie("name"));
  }else{
    alert("Usuario o contraseña no válida")
  }
}

function validateLogIn(){
  var nameLogIn = $("input[name='emailLogIn']").val();
  var name;
  var email;
  var password = $("input[name='passwordLogIn']").val();
  var cookies = decodeURIComponent(document.cookie).split(";");
  console.log(cookies);
  var pass = "";
  for(var i = 0; i <cookies.length; i++) {
    var c = cookies[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    console.log(c.split(":")[2]);
    email = c.split(":")[0];
    name = c.split(":")[1];
    if (c.split(":")[2]!=undefined && c.split(":")[2].indexOf("password") == 0) {
      pass = c.split("=")[1];
    }
    if (pass != undefined && (nameLogIn == email || nameLogIn == name) && password == pass) {
      console.log(name);
      setCookie("name", name);
      return true;
      //console.log(c.split("---")[1]);
      //console.log(c.substring(name.length, c.length).split("---"));
    }
  }
  console.log("jajaja salu2");
  return false;
 /* if($("input[name='emailLogIn']").val() == email || $("input[name='emailLogIn']").val() == username)){

  } $("input[name='passwordLogIn']").val() == password*/
}

function loadLogIn(username) {
  $("#logIn").hide();
  $(".content").show();
  $(".side1").show();
  $(".side2").hide();
  $(".user h3").text(username);
  var categories = getCookie("categories-"+username).split(":");
  for (let i = 1; i < categories.length; i++) {
    addCategory(categories[i]); 
  }
}

function addCategory(title){
  //$(".mapa").before("<section><div class='title'><h2>"+prompt("Nombre de la categoría")+"</h2><div class='dropdown'><i class='far fa-caret-square-down'></i><div class='dropdown-content'><a class='addCajaElement'>Añadir elemento</a><a class='changeTitle'>Cambiar título</a><a class='emptyColumn'>Vaciar lista</a><a class='archivar'>Archivar lista</a></div></div></section>")
  var clon = $(".content section:first").droppable("destroy").draggable("destroy").clone(true);
  clon.find(".caja").hide();
  clon.find("h2").text(title);
  clon.css({"display":"block"});
  $(".sections").append(clon);
  dragDrop();
  if(!decodeURIComponent(document.cookie).replace(/;/g, '').replace(/ /g, '').split("=").includes("category-"+title)){
    console.log("category-"+title, "");
    setCookie("category-"+title, "");
    setCookie("categories-"+$(".user h3").text(), getCookie("categories-"+$(".user h3").text())+":"+title);
  }else{
    //TODO: Añadir cada una de las cajas de cada categoría
  }
  return clon;
}

function addCaja(columna, title, description){
  var caja = $(".caja:first").droppable("destroy").draggable("destroy").clone(true);
  dragDrop();
  caja.find("h3").text(title);
  caja.find("p").first().text(description);

  /*volvemos a ponerlo todo porque si usamos clone(true) después el drag no lo hace bien (lo hace desde el que ha sido clonado)*/
  caja.draggable({revert: true});
  caja.droppable({
    drop: function( event, ui ) {
      if($(ui.draggable).hasClass("caja")){
        $(ui.draggable).detach().insertAfter($(this));
      }
    }
  });

  /* Hacemos que aunque le haya dado a like al primero, el que creemos no esté dado */
  caja.find(".fa").addClass("far").removeClass("fa");
  console.log(columna);
  caja.css({"display":"block"});
  columna.append(caja);
  
}

function dragDrop() {
  $( "section" ).draggable({
    revert: true
  });
  $( "section" ).droppable({
    drop: function( event, ui ) {
      if ($(ui.draggable).is("section")) {
        var cont = $(this).children().detach();
        $(ui.draggable).children().detach().appendTo($(this));
        cont.appendTo($(ui.draggable));
      }else if($(ui.draggable).hasClass("caja")){
        var pos = ui.draggable.position();
        if (pos.top < 0) {
          $(ui.draggable).detach().insertAfter($(this).find(".title"));
        }
      }
    }
  });
  $( ".caja" ).draggable({
    revert: true
  });
  $( ".caja" ).droppable({
    drop: function( event, ui ) {
      if($(ui.draggable).hasClass("caja")){
        $(ui.draggable).detach().insertAfter($(this));
      }
    }
  });
}

window.onclick = function(event) {
  if(!event.target.matches('.fa-caret-square-down') && !event.target.matches(".icons .fa-plus-square")) {
    $(".dropdown-content").slideUp("fast");
  }
  if (event.target.id=="commentBox") {
    $("#commentBox").fadeOut("fast");
  }
}


$(document).ready(function(){
  $(".caja").hide();
  $(".titulo").click(function (){
    $(".section").hide();
    $(".content").show();
    $("#profile").show();
    $("#homeScreen").hide();
  });

  dragDrop();
  
  $(".section").hide();
  $(".nonRegisteredHomepage").show();
  $(".profileSection").hide();
  $(".side1").hide();

  /*$('.likeButton').tooltip({
    tooltipClass: "tooltip",
    position: { my: "top+20px", at: "top center" },
  });

  $('.shareButton').tooltip({
    tooltipClass: "tooltip",
    position: { my: "top+20px", at: "top center" },
  });

  $('.commentButton').tooltip({
    tooltipClass: "tooltip",
    position: { my: "top+20px", at: "top center" },
  });*/

  $(".icons .fa-plus-square").click(function() {
    var button = $(this).parent().find(".dropdown-content").first();
    $(".dropdown-content").slideUp("fast");
    if (button.css("display") == "none") {
      button.slideDown("fast");
    }else {
      button.slideUp("fast");
    }
  });

  /* Añadir hashtag */
  $(".hashtags .fa-plus-square").click(function() {
    var text = prompt("Introduzca el hashtag que desea añadir");
    /* Controlamos que no se haya dejado el campo en blanco */
    if(text){
      var aux = $("<div class=hashtag><p>#"+text+"</p></div>");
      aux.click(function() {
        if(confirm("Seguro que quiere eliminar el hashtag "+$(this).find("p").text()+"?"))
          $(this).hide();
      });
      aux.insertBefore(this);
    }
  });

  $(".hashtag").click(function() {
    if(confirm("Seguro que quiere eliminar el hashtag "+$(this).find("p")+"?"))
      $(this).hide();
  });

  $(".fa-comment").click(function(){
    $("#commentBox").fadeIn("slow");
    $("#commentBoxText").text("¿Dónde quieres compartir el evento \""+$(this).parentsUntil("section").last().find("h3").first().text()+"\"?\n");
  });

  $("#homeScreen").click(function() {
    $(".section").hide();
    $(".content").show();
    $("#profile").show();
    $("#homeScreen").hide();
  });

  $("#startSesion").click(function() {
    $(".section").hide();
    $("#logIn").show();
  });

  $("#register").click(function() {
    $(".section").hide();
    $("#registerForm").show();
  });

  $(".likeButton").click(function(){
    if ($(this).attr("src") == "images/like.png") {
      $(this).attr("src", "images/likeClicked.png");
    }else {
      $(this).attr("src", "images/like.png");
    }
  });

  $(".shareButton").click(function(){
    $("#commentBox").fadeIn("slow");
    $("#commentBoxText").text("¿Dónde quieres compartir el evento \""+$(this).parentsUntil("section").last().find("p").first().text()+"\"?\n");
  });

  $(".emptyColumn").click(function(){
    $(this).parentsUntil(".content").last().children(".caja").fadeOut();
  });

  $(".archivar").click(function(){
    if (confirm("¿De verdad quieres eliminar esta columna?")) {
      $(this).parentsUntil(".content").last().fadeOut();
    }
  });

  dropdownContent();

  $(".fa-star").click(function(){
    /* Cambia el icono de la estrella que se clicka */
    if($(this).hasClass("far")){
      $(this).removeClass("far");
      $(this).addClass("fa");
    }else{
      $(this).removeClass("fa");
      $(this).addClass("far");
    }

    /* Cambia el icono de las estrellas anteriores */
    $(this).prevAll().removeClass("far");
    $(this).prevAll().addClass("fa");

    
    /* Cambia el icono de las estrellas posteriores */
    $(this).nextAll().removeClass("fa");
    $(this).nextAll().addClass("far");
  });

  /*$(".cross").click(function(){
    if(confirm("¿De verdad quieres eliminar esta caja?")){
      $(this).parent().hide();
    }
  });*/

  /*$(".darth_mode").click(function(){
    $("body").css({"background-image": "url(https://wallpaperplay.com/walls/full/b/3/3/84873.jpg)"});
    $(".darth_mode").hide();
    $(".stormtrooper_mode").show();
  });

  $(".stormtrooper_mode").click(function(){
    $("body").css({"background-image": "url('https://wallpaperplay.com/walls/full/5/6/9/124134.jpg')"});
    $(".stormtrooper_mode").hide();
    $(".darth_mode").show();
  });*/

  
  $("#closeSesion").click(function(){
    $(".content").hide();
    $("#profile").show();
    $("#homeScreen").hide();
    $(".side1").hide();
    $(".side2").show();
    $(".section").hide();
    $(".nonRegisteredHomepage").show();
    $("section").hide();
  });

  $("#profile").click(function() {
    $(".section").hide();
    $(".content").hide();
    $("#profile").hide();
    $("#homeScreen").show();
    $("#profileSection").show();
    var val;
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        val = $("#profileForm input[name="+keys[i]+"]")
        if (val.attr("type")=="checkbox") {
          if(getCookie(keys[i]) == "true"){
            val.prop("checked", true);
          }else {
            val.prop("checked", false);
          }
        }else{
          val.val(getCookie(keys[i]));
        }
    }

  });

  function dropdownContentElements(params) {
    $(".addCategory").click(function(){
      addCategory(prompt("Nombre de la categoría"))
    });
  
    $(".addCajaElement").click(function(){
      addCaja($(this).closest("section"), prompt("Pon el título"), prompt("Pon la descripción"));
    });
    $(".changeTitle").click(function(){
      $(this).closest("section").find("h2").text(prompt("¿Qué título le quieres poner a esta sección?"));
    });
  }
  function dropdownContentLast() {
    $(".content section:last").find(".fa-caret-square-down").click(function(){
      var button = $(this).parent().find(".dropdown-content").first();
      $(".dropdown-content").slideUp("fast");
      if (button.css("display") == "none") {
        button.slideDown("fast");
      }else {
        button.slideUp("fast");
      }
    });
    dropdownContentElementsLast();
  }
  
  function dropdownContent() {
    $(".fa-caret-square-down").click(function(){
      var button = $(this).parent().find(".dropdown-content").first();
      $(".dropdown-content").slideUp("fast");
      if (button.css("display") == "none") {
        button.slideDown("fast");
      }else {
        button.slideUp("fast");
      }
    });
    dropdownContentElements();
  }
});
