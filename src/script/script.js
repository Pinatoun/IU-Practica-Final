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
  document.cookie = name+"="+value+"; expires=Thu, 01 Jan 2100 00:00:00 UTC;";
}

function deleteCookie(name){
  document.cookie = name+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}

function removeFromCookie(name, value){
  var cookie = getCookie(name);
  document.cookie = name+"="+cookie.replace(value, "");
}

function getCajasCategory(category){
  return getCookie("category-"+category).split(":");
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

  //añade también el textarea y select
  setCookie("users", getCookie("users")+":"+username);
  setCookie(email+":"+username+":"+$(subButon + " textarea").attr("name"), $(subButon + " textarea").val());
  setCookie(email+":"+username+":"+$(subButon + " select").attr("name"), $(subButon + " select").val());

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
  $(":input").not(":submit").not(document.getElementById("Borrar")).val("");
  $(':checkbox').each(function(){ //iterate all listed checkbox items
		this.checked = false; //change ".checkbox" checked status
	});
}

function addComment(){
  var message = getCookie("name")+": "+$("#commentBoxInput").val();
  $("<p class=comment>"+message+"</p>").insertBefore("#commentBoxInput");
  setCookie(getCookie("activeComment")+"-comments", getCookie(getCookie("activeComment")+"-comments")+"---"+message)
  $("#commentBoxInput").val("");
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
      setCookie("email", email);
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
    addCategoryLogIn(categories[i]);
    addCajasCategory(categories[i]);
  }
}

function addCajasCategory(category){
  var cajas = getCajasCategory(category);
  var columna = $(".title:contains("+ category+")").closest("section");
  var result = "";
  for (const caja of cajas) {
    if(caja != ""){
      result = addCajaLogIn(columna, caja, getCookie("category-"+category+"-activity-"+caja+"-description"));
      addHashtags(result.find(".fa-plus-square"));
      addStars(result);
    }
  }
}

function addStars(caja){
  var cookie = "category-"+caja.closest("section").find(".title h2").text()+"-activity-"+caja.find("h3").text()+"-stars";
  var star = caja.find(".fa-star");
  console.log("las estrellas: "+getCookie(cookie));
  for (let i = 0; i <= getCookie(cookie); i++) {
    $(star[i]).addClass("fa");
    $(star[i]).removeClass("far");
  }
}

/* Añadir hashtag */
function addHashtag(object, text) {
  /* Controlamos que no se haya dejado el campo en blanco */
  if(text){
    var aux = $("<div class=hashtag><p>"+text+"</p></div>");
    aux.click(function() {
      if(confirm("Seguro que quiere eliminar el hashtag "+$(this).find("p").text()+"?"))
        $(this).hide();
        removeFromCookie("category-"+$(this).closest("section").find(".title h2").text()+"-activity-"+$(this).closest(".hashtags").prev().find("h3").text()+"-hashtags", $(this).find("p").text());
    });
    aux.insertBefore(object); 
  }
}

function addHashtags(button){
  var category = button.closest("section").find(".title h2").text();
  var activity = button.closest(".hashtags").prev().find("h3").text();
  var hashtags = getCookie("category-"+category+"-activity-"+activity+"-hashtags").split("#");
  for (const hashtag of hashtags) {
    if(hashtag != "")
      addHashtag(button, "#"+hashtag);
  }
}

function addCategory(title){
  if(getCookie("categories-"+getCookie("name")).split(":").includes(title)){
    alert("La categoría " + title + " ya existe, por favor introduzca un nombre diferente");
    return;
  }else{
    setCookie("category-"+title, "");
    setCookie("categories-"+$(".user h3").text(), getCookie("categories-"+$(".user h3").text())+":"+title);
  }
  addCategoryLogIn(title);
}

function addCategoryLogIn(title){
  //$(".mapa").before("<section><div class='title'><h2>"+prompt("Nombre de la categoría")+"</h2><div class='dropdown'><i class='far fa-caret-square-down'></i><div class='dropdown-content'><a class='addCajaElement'>Añadir elemento</a><a class='changeTitle'>Cambiar título</a><a class='emptyColumn'>Vaciar lista</a><a class='archivar'>Archivar lista</a></div></div></section>")
  //Controlamos que el título no esté ya añadido
  if ($(".title h2").text().includes("title")) {
    return;
  }
  var clon = $(".content section:first").droppable("destroy").draggable("destroy").clone(true);
  clon.find(".caja").hide();
  clon.find("h2").text(title);
  clon.css({"display":"block"});
  $(".sections").append(clon);
  dragDrop();
  return clon;
}

function addCaja(columna, title, description){
  if (!getCajasCategory(columna.find(".title h2").text()).includes(title)) {
    addCajaCommon(columna, title, description);
    setCookie("category-"+columna.find(".title h2").text(), getCookie("category-"+columna.find(".title h2").text())+":"+title);
    setCookie("category-"+columna.find(".title h2").text()+"-activity-"+title+"-description", description);
    setCookie("category-"+columna.find(".title h2").text()+"-activity-"+title+"-hashtags", "");
    setCookie("category-"+columna.find(".title h2").text()+"-activity-"+title+"-stars", "-1");
    setCookie("category-"+columna.find(".title h2").text()+"-activity-"+title+"-comments", "");
  }else{
    alert("La categoría "+columna.find(".title h2").text()+" ya tiene la actividad "+title);
  }
}

function addCajaLogIn(columna, title, description){
  var caja = addCajaCommon(columna, title, description);
  getCookie("category-"+columna.find(".title h2").text()+"-activity-"+title+"-stars");
  getCookie("category-"+columna.find(".title h2").text()+"-activity-"+title+"-comments");
  return caja;
}


function addToCategory(element){
  var categoryName = $(element).text();
  var titles = $(".title h2");
  for (const title of titles) {
    if($(title).text() == categoryName){
      var newTitle = prompt("Pon el título");
      var description = prompt("Pon la descripción");
      if (newTitle != "" && newTitle != undefined && description != "" && description != undefined) {
        addCaja($(title).closest("section"), newTitle, description);
      }else{
        alert("No puedes dejar el título ni la descripción en blanco");
      }
    }
  }
}

function addCajaCommon(columna, title, description){
  var caja = $(".caja:first").droppable("destroy").draggable("destroy").clone(true);
  caja.find("h3").text(title);
  caja.find("p").first().text(description);
  /* Hacemos que aunque le haya dado a like al primero, el que creemos no esté dado */
  caja.find(".fa").addClass("far").removeClass("fa");
  console.log(columna);
  caja.css({"display":"block"});
  columna.append(caja);
  dragDrop();

  return caja;
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
        var categories = getCookie("categories-"+getCookie("name")).split(":");
        for (let i = 0; i < categories.length; i++) {
          if(categories[i] == $(this).find("h2").text()){
            var thisTitle = i;
          }else if(categories[i] == $(ui.draggable).find("h2").text()){
            var dragTitle = i;
          }
        }
        var aux = categories[thisTitle];
        categories[thisTitle] = categories[dragTitle];
        categories[dragTitle] = aux;
        setCookie("categories-"+getCookie("name"), categories.join(":"));
      }else if($(ui.draggable).hasClass("caja")){
        var category = $(this).find(".title h2").text();
        var pos = ui.draggable.position();
        var titleCaja = $(ui.draggable).find("h3").text();
        if (pos.top < 0 && !getCajasCategory(category).includes(titleCaja)) {
          $(ui.draggable).detach().insertAfter($(this).find(".title"));
          var title = $(this).find("h2").text();
          var titleOld = getCookie("titleOld");
          setCookie("category-"+title, ":"+titleCaja+getCookie("category-"+title));
          if(title!=titleOld){
            setCookie("category-"+title+"-activity-"+titleCaja+"-description", getCookie("category-"+titleOld+"-activity-"+titleCaja+"-description"));
            setCookie("category-"+title+"-activity-"+titleCaja+"-hashtags", getCookie("category-"+titleOld+"-activity-"+titleCaja+"-hashtags"));
            setCookie("category-"+title+"-activity-"+titleCaja+"-stars", getCookie("category-"+titleOld+"-activity-"+titleCaja+"-stars"));
            setCookie("category-"+title+"-activity-"+titleCaja+"-comments", getCookie("category-"+titleOld+"-activity-"+titleCaja+"-comments"));
            removeFromCookie("category-"+titleOld, ":"+titleCaja)
            deleteCookie("category-"+titleOld+"-activity-"+titleCaja+"-description");
            deleteCookie("category-"+titleOld+"-activity-"+titleCaja+"-hashtags");
            deleteCookie("category-"+titleOld+"-activity-"+titleCaja+"-stars");
            deleteCookie("category-"+titleOld+"-activity-"+titleCaja+"-comments");
          }
        }
      }
    }
  });
  $( ".caja" ).draggable({
    start: function() {
      var title = $(this).parent("section").find("h2").text();
      setCookie("titleOld", title);
    },
    revert: true
  });
  $( ".caja" ).droppable({
    drop: function( event, ui ) {
      if($(ui.draggable).hasClass("caja")){
        var category = $(this).closest("section").find(".title h2").text();
        var titleCaja = $(ui.draggable).find("h3").text();
        var titleOld = getCookie("titleOld");
        if(!getCajasCategory(category).includes(titleCaja) || category == titleOld){
          var title = $(this).parent("section").find("h2").text();
          var titleDroppedCaja = $(this).find("h3").text();
          $(ui.draggable).detach().insertAfter($(this));
          removeFromCookie("category-"+titleOld, ":"+titleCaja)
          var splitted = getCookie("category-"+title).split(":");
          for (let i = 0; i < splitted.length; i++) {
            if(splitted[i] == titleDroppedCaja){
              splitted.splice(i+1, 0, titleCaja);
              break;
            }
          }
          setCookie("category-"+title, splitted.join(":"));
          if(title != titleOld){
            setCookie("category-"+title+"-activity-"+titleCaja+"-description", getCookie("category-"+titleOld+"-activity-"+titleCaja+"-description"));
            deleteCookie("category-"+titleOld+"-activity-"+titleCaja+"-description");
            setCookie("category-"+title+"-activity-"+titleCaja+"-hashtags", getCookie("category-"+titleOld+"-activity-"+titleCaja+"-hashtags"));
            deleteCookie("category-"+titleOld+"-activity-"+titleCaja+"-hashtags");
            setCookie("category-"+title+"-activity-"+titleCaja+"-stars", getCookie("category-"+titleOld+"-activity-"+titleCaja+"-stars"));
            deleteCookie("category-"+titleOld+"-activity-"+titleCaja+"-stars");
            setCookie("category-"+title+"-activity-"+titleCaja+"-comments", getCookie("category-"+titleOld+"-activity-"+titleCaja+"-comments"));
            deleteCookie("category-"+titleOld+"-activity-"+titleCaja+"-comments");
          }
        }
        else  
          alert("Esa actividad ya está presente en la categoría a la que la quieres mover");
      }
    }
  });
}

function restoreArchivedCategory(cat) {
  removeFromCookie("archived-"+getCookie("name"), ":"+$(cat).text());
  setCookie("categories-"+getCookie("name"), getCookie("categories-"+getCookie("name"))+":"+$(cat).text());
  addCategoryLogIn($(cat).text());
  addCajasCategory($(cat).text());
}

function inviteToCategory(element){
  var title = $(element).closest("section").find("h2").text();
  var username = $(element).text();
  setCookie("notifications-"+username, getCookie("notifications-"+username)+":"+title);
}

function acceptInvite(invitation) {
  removeFromCookie("notifications-"+getCookie("name"), ":"+$(invitation).text());
  setCookie("categories-"+getCookie("name"), getCookie("categories-"+getCookie("name"))+":"+$(invitation).text());
  addCategoryLogIn($(invitation).text());
  addCajasCategory($(invitation).text());
}

window.onclick = function(event) {
  if(!event.target.matches('.fa-caret-square-down') && !event.target.matches(".icons .fa-plus-square") && !event.target.matches(".icons .fa-bell") && !event.target.matches(".icons .fa-archive") && !event.target.matches(".shareCategory") && !event.target.matches(".addElement")) {
    console.log(event.target);
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
  function showDropDown(dd) {
    var button = $(dd).parent().find(".dropdown-content").first();
    $(".dropdown-content").slideUp("fast");
    if (button.css("display") == "none") {
      button.slideDown("fast");
    }else {
      button.slideUp("fast");
    }
  }
  $(".icons .fa-plus-square").click(function() {
    showDropDown(this);
  });

  $(".icons .fa-archive").click(function() {
    var archivedCategories = getCookie("archived-"+getCookie("name")).split(":");
    $(this).next().empty();
    if (archivedCategories == "") {
      $(this).next().append("<p> No hay ninguna categoría archivada </p>");
    }else{
      $(this).next().append("<h4> Elementos archivados: </h4>");
      for (const category of archivedCategories) {
        if(category != ""){
          $(this).next().append("<a onclick='restoreArchivedCategory(this)'>"+category+"</a>");
        }
      }
    }
    showDropDown(this);
  });

  $(".icons .fa-bell").click(function() {
    var notifications = getCookie("notifications-"+getCookie("name")).split(":");
    $(this).next().empty();
    if (notifications == "") {
      $(this).next().append("<p> No hay ninguna notificación pendiente </p>");
    }else{
      for (const notification of notifications) {
        if(notification != ""){
          $(this).next().append("<a onclick='acceptInvite(this)'>"+notification+"</a>");
        }
      }
    }
    showDropDown(this);
  });

  $(".hashtags .fa-plus-square").click(function(){
    var text = "#" + prompt("Introduzca el hashtag que desea añadir");
    if(text != "#" && text != "#null"){
      var cookie = "category-"+$(this).closest("section").find(".title h2").text()+"-activity-"+$(this).closest(".hashtags").prev().find("h3").text()+"-hashtags";
      addHashtag($(this), text);
      setCookie(cookie, getCookie(cookie) + text);
    }
  });

  $(".hashtag").click(function() {
    if(confirm("Seguro que quiere eliminar el hashtag "+$(this).find("p")+"?")){
      $(this).hide();
      removeFromCookie("category-"+$(this).closest("section").find(".title h2").text()+"-activity-"+$(this).closest(".hashtags").prev().find("h3").text()+"-hashtags", $(this).find("p").text());
    }
  });

  $(".fa-comment").click(function(){
    $("#commentBox").fadeIn("slow");
    $("#commentBoxTitle").text("Comentarios de la actividad \""+$(this).parentsUntil("section").last().find("h3").first().text()+"\"\n");
    setCookie("activeComment", "category-"+$(this).closest("section").find(".title h2").text()+"-activity-"+$(this).closest(".caja").find("h3").text());
    var comments = getCookie("category-"+$(this).closest("section").find(".title h2").text()+"-activity-"+$(this).closest(".caja").find("h3").text()+"-comments").split("---");
    $(".comment").hide();
    for (const comment of comments) {
      if (comment != "") {
        $("<p class=comment>"+comment+"</p>").insertBefore("#commentBoxInput");  
      }
    }

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
    $("#commentBoxTitle").text("Comentarios de la actividad \""+$(this).parentsUntil("section").last().find("p").first().text()+"\"\n");
  });

  $(".emptyColumn").click(function(){
    if (confirm("¿De verdad quieres eliminar todas las actividades de esta categoría?")) {
      var cajas = $(this).parents("section").children(".caja");
      var title = $(this).parents("section").find(".title h2").text();
      for (let i = 0; i < cajas.length; i++) {
        const caja = cajas[i];
        setCookie("category-"+title, "");
        deleteCookie("category-"+title+"-activity-"+$(caja).find("h3").text()+"-description");
        deleteCookie("category-"+title+"-activity-"+$(caja).find("h3").text()+"-hashtags");
        deleteCookie("category-"+title+"-activity-"+$(caja).find("h3").text()+"-stars");
        deleteCookie("category-"+title+"-activity-"+$(caja).find("h3").text()+"-comments");
      }
      cajas.fadeOut();
    }
  });

  $(".shareCategory").click(function(){
    var users = getCookie("users").split(":");
    var added = false
    $(this).next().empty();
    for (const user of users) {
      if(user != "" && !getCookie("categories-"+user).split(":").includes($(this).closest("section").find("h2").text())){
        $(this).next().append("<a onclick='inviteToCategory(this)'>"+user+"</a>");
        added = true;
      }
    }
    if(!added){
      $(this).next().append("<a> No hay ningún otro usuario registrado al que puedas invitar </a>");
    }
    var button = $(this).parent().find(".dropdown-content").first();
    if (button.css("display") == "none") {
      button.slideDown("fast");
    }else {
      button.slideUp("fast");
    }
  });

  

  $(".archivar").click(function(){
    if (confirm("¿De verdad quieres archivar esta columna?")) {
      $(this).parents("section").fadeOut();
      removeFromCookie("categories-"+getCookie("name"), ":"+$(this).parents("section").find("h2").text())
      setCookie("archived-"+getCookie("name"), getCookie("archived-"+getCookie("name"))+":"+$(this).parents("section").find("h2").text());
    }
  });

  dropdownContent();

  $(".fa-star").click(function(){
    /* Cambia el icono de la estrella que se clicka */
    var cookie = "category-"+$(this).closest("section").find(".title h2").text()+"-activity-"+$(this).closest(".caja").find("h3").text()+"-stars";
    if($(this).hasClass("fa") && !$(this).next().hasClass("fa")){
      $(this).removeClass("fa");
      $(this).addClass("far");
      setCookie(cookie, ($(this).prevAll().length-1));
      console.log("Se ha puesto las estrellas a " +($(this).prevAll().length-1));
    }else{
      $(this).removeClass("far");
      $(this).addClass("fa");
      console.log("Se ha puesto las estrellas a " +$(this).prevAll().length);
      setCookie(cookie, $(this).prevAll().length);
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
    var inputs = $("#profileForm input");

    for(input of inputs){
      if ($(input).attr("type")=="checkbox") {
        if(getCookie(getCookie("email")+":"+getCookie("name")+":"+$(input).attr("name")) == "true"){
          $(input).prop("checked", true);
        }else {
          $(input).prop("checked", false);
        }
      }else if ($(input).attr("type")!="submit"){
        $(input).val(getCookie(getCookie("email")+":"+getCookie("name")+":"+$(input).attr("name")));
      }
    }

    $("#profileForm textArea").val(getCookie(getCookie("email")+":"+getCookie("name")+":"+$("#profileForm textArea").attr("name")));
    $("#profileForm select").val(getCookie(getCookie("email")+":"+getCookie("name")+":"+$("#profileForm select").attr("name")));

    /*while ( i-- ) {
        val = $("#profileForm input[name="+keys[i]+"]")
        if (val.attr("type")=="checkbox") {
          if(getCookie(keys[i]) == "true"){
            val.prop("checked", true);
          }else {
            val.prop("checked", false);
          }
        }else{
          val.val(getCookie(getCookie("email")+":"+getCookie("name")+keys[i]));
        }
    }*/

  });

  function dropdownContentElements(params) {
    $(".addCategory").click(function(){
      var title = prompt("Nombre de la categoría");
      if(title != ""){
        addCategory(title);
      }else{
        alert("No puedes dejar el título en blanco");
      }
    });

    $(".addElement").click(function(){
      var categories = getCookie("categories-"+getCookie("name")).split(":");
      var added = false
      $(this).next().empty();
      for (const category of categories) {
        if(category != ""){
          $(this).next().append("<a onclick='addToCategory(this)'>"+category+"</a>");
          added = true;
        }
      }
      if(!added){
        $(this).next().append("<a> No tienes ninguna categoría añadida </a>");
      }
      var button = $(this).parent().find(".dropdown-content").first();
      if (button.css("display") == "none") {
        button.slideDown("fast");
      }else {
        button.slideUp("fast");
      }
    
    });
  
    $(".addCajaElement").click(function(){
      var title = prompt("Pon el título");
      var description = prompt("Pon la descripción");
      if (title != "" && title != undefined && description != "" && description != undefined) {
        addCaja($(this).closest("section"), title, description);
      }else{
        alert("No puedes dejar el título ni la descripción en blanco");
      }
    });
    $(".changeTitle").click(function(){
      var title = prompt("¿Qué título le quieres poner a esta sección?");
      if(getCookie("categories-"+getCookie("name")).split(":").includes(title)){
        alert("La categoría " + title + " ya existe, por favor introduzca un nombre diferente");
        return;
      }
      var titleOld = $(this).closest("section").find("h2").text();
      if(title != ""){
        var titleCajas= getCajasCategory(titleOld);
        for (let i = 0; i < titleCajas.length; i++) {
          setCookie("category-"+title+"-activity-"+titleCajas[i]+"-description", getCookie("category-"+titleOld+"-activity-"+titleCajas[i]+"-description"));
          setCookie("category-"+title+"-activity-"+titleCajas[i]+"-hashtags", getCookie("category-"+titleOld+"-activity-"+titleCajas[i]+"-hashtags"));
          setCookie("category-"+title+"-activity-"+titleCajas[i]+"-stars", getCookie("category-"+titleOld+"-activity-"+titleCajas[i]+"-stars"));
          setCookie("category-"+title+"-activity-"+titleCajas[i]+"-comments", getCookie("category-"+titleOld+"-activity-"+titleCajas[i]+"-comments"));
          deleteCookie("category-"+titleOld+"-activity-"+titleCajas[i]+"-description");
          deleteCookie("category-"+titleOld+"-activity-"+titleCajas[i]+"-hashtags");
          deleteCookie("category-"+titleOld+"-activity-"+titleCajas[i]+"-stars");
          deleteCookie("category-"+titleOld+"-activity-"+titleCajas[i]+"-comments");
        }
        setCookie("categories-"+getCookie("name"), getCookie("categories-"+getCookie("name")).replace(":"+titleOld, ":"+title));

        $(this).closest("section").find("h2").text(title);
      }
      
    });
    $(".changeCajaTitle").click(function(){
      var category = $(this).closest("section").find("h2").text();
      var newTitle = prompt("Introduzca el nuevo nombre de la actividad");
      if(!getCajasCategory(category).includes(newTitle)){

      }else{
        alert("La actividad "+activity+" ya existe en la categoría "+category+". Por favor, escoja otro nombre");
      }
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
