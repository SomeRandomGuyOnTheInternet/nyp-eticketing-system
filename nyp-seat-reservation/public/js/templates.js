// The variables you see here are ejs templates that will be used for client side templating, so that we can to create html on the fly easily for stuff like ajax
// Some of these templates, like toast, are exact copies of the ones you see in the templates folder on the server 

const templates = {
    toast: '<% for (var i = 0; i < notifications.length; i++) { %> <div class="toast bg-<%= notifications[i].type %>-75" role="alert" aria-live="assertive" aria-atomic="true" data-delay="100000"> <div class="toast-body p-4"> <div class="container-fluid p-0"> <div class="row"> <div class="col-10"> <span class="h5 text-white font-weight-medium"><%= notifications[i].message %></span> </div> <div class="col-2"> <button type="button" class="close" data-dismiss="toast" aria-label="Close"> <span aria-hidden="true" class="text-white">×</span> </button> </div> </div> </div> </div> </div> <% } %>'
}