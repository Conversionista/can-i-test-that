"use strict";function addProgress(e){progress+=e,$("body").loadie(progress)}function finishProgress(){progress=1,$("body").loadie(progress)}function saveLocal(e,t){localStorage.setItem(e,JSON.stringify(t))}function readLocal(e){var t=JSON.parse(localStorage.getItem(e));return t}function updateLocal(e,t,o){var a=readLocal(e);null===a&&(a={}),a[t]=o,saveLocal(e,a)}function setCookie(e,t,o){if(o!==!1){var a=new Date;a.setTime(a.getTime()+24*o*60*60*1e3);var n="; expires="+a.toGMTString();document.cookie=e+"="+t+n}document.cookie=e+"="+t}function getCookie(e){var t="; "+document.cookie,o=t.split("; "+e+"=");if(2===o.length){var a=o.pop().split(";").shift();return a}}function isInt(e){return!isNaN(e)&&parseInt(Number(e))===e&&!isNaN(parseInt(e,10))}function log(e){var t=readLocal("settings");null!==t&&t.debug===!0&&console.log(e)}function merge_options(e,t){var o={};for(var a in e)o[a]=e[a];for(var a in t)o[a]=t[a];return o}function debug(e){e===!0?updateLocal("settings","debug",!0):updateLocal("settings","debug",!1)}function getId(e){var t=readLocal("feasibility_calc");return"accountId"===e?t.accountId:"propertyId"===e?t.propertyId:"profileId"===e?t.profileId:t}function showError(e,t){swal({title:e,html:!0,text:t,type:"error",confirmButtonText:"Ok :("})}function createReportQuery(e){var t=readLocal("feasibility_calc"),o={viewId:t.profileId,samplingLevel:"LARGE",dateRanges:[{startDate:moment().subtract(28,"days").format("YYYY-MM-DD"),endDate:moment().subtract(1,"days").format("YYYY-MM-DD")}],metrics:e};return o}function authorize(e){addProgress(.13);var t=!e,o={client_id:CLIENT_ID,scope:SCOPES,immediate:t};gapi.auth.authorize(o,function(e){if(log(e),e.error)if(getCookie("fc_auth_count")>=3)showError("Could't authorize.",'<i>Check the console for details</i>.<br />If the problem presists, try some of the following: <ol><li>Try to reload the page</li><li>Clear the cookies for this website</li><li>Revoke the authorization for this app in your <a href="https://security.google.com/settings/security/permissions" target="_blank">Google Settings</a></li></ol>'),console.info(e.error);else{var t=parseInt(getCookie("fc_auth_count"));isInt(t)===!1&&(t=0),t=parseInt(t+1),setCookie("fc_auth_count",t,!1),showAuthDialog()}else e.status.google_logged_in===!0&&log("google logged in"),e.status.signed_in===!0&&log("signed in"),log("Authorized"),addProgress(.13),gapi.client.load("plus","v1",apiClientLoaded),queryAccounts()})}function queryReports(e,t){gapi.client.load(DISCOVERY).then(function(){gapi.client.analyticsreporting.reports.batchGet({reportRequests:[t]}).then(function(e){var t=JSON.stringify(e.result,null,2);document.getElementById("query-output").value=t,$("#go").attr("disabled",!1).html("Go!")}).then(null,function(e){showError("Reporting API Query","Something went wrong using the Reporting API V4.<br /> <b>Check the console for more details (cmd + alt + j).</b>"),console.info(e)})})}function showAuthDialog(){swal({title:"GA Authorization",html:!0,text:"We'll need to premission to access your GA Account.<br /> We won't save any infomation what so ever.",imageUrl:"images/noun_143742_cc.svg",confirmButtonText:"Authorize",confirmButtonColor:"#5cb85c",customClass:"authorize",showCancelButton:!1}),$(".authorize .confirm").click(function(e){$(this).html('<i class="fa fa-cog fa-spin"></i>').attr("disabled",!0),authorize(e)})}function handleAccounts(e){if(addProgress(.13),e.result.items&&e.result.items.length){$("#accountId").html("").attr("disabled",!1),$.each(e.result.items,function(e,t){$("#accountId").append($("<option/>",{value:t.id,text:t.name}))}),finishProgress();var t=readLocal("feasibility_calc");"null"===t||null===t||void 0===t?$("#modalSettings").modal():($("#accountId").val(t.accountId),queryProperties(t.accountId))}else showError("No accounts","No accounts found for this user.")}function queryAccounts(){gapi.client.load("analytics","v3").then(function(){gapi.client.analytics.management.accounts.list().then(handleAccounts)})}function handleProperties(e){if(e.result.items&&e.result.items.length){$("#propertyId").html("").attr("disabled",!1),$.each(e.result.items,function(e,t){$("#propertyId").append($("<option/>",{value:t.id,text:t.name}))});var t=readLocal("feasibility_calc");t.propertyId?($("#propertyId").val(t.propertyId),queryProfiles(t.accountId,t.propertyId)):$("#modalSettings").modal()}else showError("No Properties","No properties found for this user.")}function queryProperties(e){gapi.client.analytics.management.webproperties.list({accountId:e}).then(handleProperties).then(null,function(e){showError("Properties Query","Check the console for more details."),console.info(e)})}function handleProfiles(e){if(e.result.items&&e.result.items.length){$("#profileId").html("").attr("disabled",!1),$.each(e.result.items,function(e,t){$("#profileId").append($("<option/>",{value:t.id,text:t.name}))});var t=readLocal("feasibility_calc");t.profileId?$("#profileId").val(t.profileId):$("#modalSettings").modal(),log(t),$("#go").text("Go!").attr("disabled",!1)}else showError("No Views","No views (profiles) found for this user.")}function queryProfiles(e,t){gapi.client.analytics.management.profiles.list({accountId:e,webPropertyId:t}).then(handleProfiles).then(null,function(e){showError("Profiles Query","Check the console for more details."),console.info(e)})}function calculateMDU(e,t,o){var a=$("#sigLvl").val(),n=$("#noWeeks").val();o!==!0&&(n=o);var r=$("#noVar").val();return Math.sqrt(a*r*(1-t)/t/(e*n))}function querySequenceQuery(e,t,o,a,n){gapi.client.analytics.data.ga.get({ids:"ga:"+getId("profileId"),"start-date":moment().subtract(28,"days").format("YYYY-MM-DD"),"end-date":moment().subtract(1,"days").format("YYYY-MM-DD"),metrics:"ga:users",samplingLevel:"HIGHER_PRECISION",segment:"users::sequence::"+e+";->>"+t}).then(function(e){var r=parseInt(e.result.rows[0]),i=r/o,s="#"+a+" .res1";updateLocal(a,"n2",t),updateLocal(a,"u2",r),updateLocal(a,"c2",i),0===r?$(s).html('<i class="fa fa-warning" data-toggle="popover" data-placement="bottom" title="No users found" data-content="Please, check the spelling of your dynamic segment."></i>'):isFinite(i)||isFinite(r)||!isNaN(i)||!isNaN(r)?$(s).html(numeral(calculateMDU(o,i,!0)).format("0%")):$(s).html("∞"),n===len-1&&($("#go").html("Go!").attr("disabled",!1),$(".showGraph").attr("disabled",!1),$('[data-toggle="popover"]').popover({trigger:"hover"}))}).then(null,function(e){console.log(e)})}function queryBounceQuery(e,t,o){gapi.client.analytics.data.ga.get({ids:"ga:"+getId("profileId"),"start-date":moment().subtract(28,"days").format("YYYY-MM-DD"),"end-date":moment().subtract(1,"days").format("YYYY-MM-DD"),metrics:"ga:users, ga:bounceRate",samplingLevel:"HIGHER_PRECISION",segment:"users::condition::"+e}).then(function(a){var n=parseInt(a.result.rows[0][0]),r=parseInt(a.result.rows[0][1]),i=(100-r)/100,s="#"+t+" .res0";updateLocal(t,"n1",e),updateLocal(t,"u1",n),updateLocal(t,"c1",i),0===n?$(s).html('<i class="fa fa-warning" data-toggle="popover" data-placement="bottom" title="No users found" data-content="Please, check the spelling of your dynamic segment."></i>'):isFinite(i)||isFinite(n)||!isNaN(i)||!isNaN(n)?$(s).html(numeral(calculateMDU(n,i,!0)).format("0%")):$(s).html("∞");var l="#"+t,c=$(l).find("input");querySequenceQuery($(c[0]).val(),$(c[1]).val(),n,t,o)}).then(null,function(e){console.log(e)})}function getFormValues(){var e=$("table.table tbody tr");len=e.length,console.log(len),e.each(function(e){console.log(e);var t=$(this).attr("id"),o=$(this).find("input");queryBounceQuery($(o[0]).val(),t,e)})}function handleEmailResponse(e){if(!e.error){var t;if(e.emails){for(var o=0;o<e.emails.length;o++)"account"===e.emails[o].type&&(t=e.emails[o].value);t&&(fcIdentify(e.displayName,t),hideLoginButton())}}}function apiClientLoaded(){gapi.client.plus.people.get({userId:"me"}).execute(handleEmailResponse)}function fcIdentify(e,t){log(e+"\n"+t)}function hideLoginButton(){$("#gConnect").hide()}function guidGenerator(){var e=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)};return e()+e()+""+e()+e()+e()+e()+e()+e()}function setId(){var e=guidGenerator();$("#firstRow").attr("id",e)}function addRow(){$(".table").find("tbody").append($('<tr id="'+guidGenerator()+'">').append($("<td>").append($('<input class="form-control" value="ga:pagePath==conversionista.se/" placeholder="ga:pagePath==example.com/" required />'))).append($('<td class="res0">').append($("<span>–</span>"))).append($("<td>").append($('<input class="form-control" value="ga:goal12Completions>0" placeholder="ga:pagePath==example.com/checkout" required />'))).append($('<td class="res1">').append($("<span>–</span>"))).append($("<td>").append($('<button class="btn btn-default btn-sm showGraph">Show Graph</button>'))).append($("<td>").append($('<button class="btn btn-link delete"><i class="fa fa-trash"></i></button>'))))}function deleteRow(e){var t="#"+e;swal({title:"Are you sure?",text:"This action can't be undone.",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"Yes, delete it!",closeOnConfirm:!1},function(){$(t).remove(),swal({title:"Deleted!",text:"The row has been deleted.",type:"success",timer:1e3,showConfirmButton:!1})})}function addDeleteListener(){$("button.delete").on("click",function(){deleteRow($(this).parent().parent().attr("id"))})}function addGraphListener(){$(".showGraph").on("click",function(){$("#modalChart").modal();var e=$(this).parent().parent().attr("id");window.setTimeout(function(){renderChart(e)},500)})}function calculatePlot(e,t,o){var a=[],n=readLocal(e),r=n.u1,i=n.c1;return o===!0&&(r=n.u2,i=n.c2),$.each(t,function(e,t){var o=calculateMDU(r,i,t);a.push(100*o)}),a}function renderChart(e){var t=[1,2,3,4,5,7,8,9,10,11,12],o=readLocal(e),a=$("#chart"),n=calculatePlot(e,t,!1),r=calculatePlot(e,t,!0),i={labels:t,datasets:[{label:o.n1,tension:0,backgroundColor:"rgba(179,181,198,0.2)",borderColor:"rgba(179,181,198,1)",pointBackgroundColor:"rgba(179,181,198,1)",pointBorderColor:"#fff",pointHoverBackgroundColor:"#fff",pointHoverBorderColor:"rgba(179,181,198,1)",data:n},{label:o.n2,tension:0,backgroundColor:"rgba(255,99,132,0.2)",borderColor:"rgba(255,99,132,1)",pointBackgroundColor:"rgba(255,99,132,1)",pointBorderColor:"#fff",pointHoverBackgroundColor:"#fff",pointHoverBorderColor:"rgba(255,99,132,1)",data:r}]};new Chart(a,{type:"line",data:i,options:{tension:0,title:{display:!0,text:"Custom Chart Title"},defaultFontFamily:'"Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif',scales:{xAxes:[{time:{unit:"week"}}]}}})}var len,queryData=[];$("body").loadie(),$(".loadie").fadeIn();var progress=.2;window.cookieconsent_options={message:"This website uses cookies to ensure you get the best experience.",dismiss:"Got it!",learnMore:"Read more.",link:"https://conversionista.se/kakor-och-personuppgifter/",theme:"dark-bottom"};var CLIENT_ID="605645049061-a0oej37pp7nipl654qmmk75k6s5pb46l.apps.googleusercontent.com",DISCOVERY="https://analyticsreporting.googleapis.com/$discovery/rest",SCOPES=["https://www.googleapis.com/auth/analytics.readonly","https://www.googleapis.com/auth/plus.me","https://www.googleapis.com/auth/plus.profile.emails.read"];$("#go").text("Loading..."),$("#go").on("click",function(e){$(this).html('<i class="fa fa-cog fa-spin"></i>').attr("disabled",!0),getFormValues(),e.preventDefault()}),$("#accountId").on("change",function(){queryProperties(this.value),updateLocal("feasibility_calc","accountId",this.value)}),$("#propertyId").on("change",function(){queryProfiles($("#accountId").val(),this.value),updateLocal("feasibility_calc","propertyId",this.value)}),$("#profileId").on("change",function(){updateLocal("feasibility_calc","profileId",this.value)}),$(document).ready(function(){$(":checkbox").checkboxpicker(),$('[data-toggle="tooltip"]').tooltip()}),setId(),$("#addRow").click(function(){addRow(),addDeleteListener(),addGraphListener()}),$(document).ready(function(){addGraphListener()}),$("#modalChart").on("show.bs.modal",function(e){window.setTimeout(function(){var e=$("#modalChart .modal-body").innerHeight(),t=$("#modalChart .modal-body").innerWidth();t-=40,$("#chart").attr("height",e).attr("width",t)},500)}),$("#save").on("click",function(){event.preventDefault();var e=[];$("table tbody tr").each(function(t,o){console.log($(o).attr("id"));var a=$(o).attr("id"),n=readLocal(a);console.log(n),null!==n?e.push(n):showError("No data?","There seems to be no data to save. Please hit <b>go</b> and try again.")}),swal({title:"An input!",text:"Write something interesting:",type:"input",showCancelButton:!0,closeOnConfirm:!1,animation:"slide-from-top",inputPlaceholder:"Write something"},function(t){return t===!1?!1:""===t?(swal.showInputError("You need to write something!"),!1):(console.log(JSON.stringify(e)),saveLocal("fc_save_"+guidGenerator(),e),void swal("Nice!","You wrote: "+t,"success"))})});