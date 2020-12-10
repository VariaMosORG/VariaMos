<!--
 @author Daniel Correa <dcorreab@eafit.edu.co>
-->
<template>
  <!-- Sidebar -->
  <ul v-bind:style="{ background: configApp.getSidebarBackgroundColor() }" class="navbar-nav sidebar sidebar-dark accordion"  id="accordionSidebar">

      <!-- Sidebar - Brand -->
      <router-link to="/">
      <a class="sidebar-brand d-flex align-items-center justify-content-center">
          <div id="main-icon" class="sidebar-brand-icon rotate-n-15 display-icon">
              V
           </div>
          <div class="sidebar-brand-text mx-3">VariaMos</div>
      </a>
      </router-link>

      <!-- Divider -->
      <hr class="sidebar-divider my-0">

      <!-- Nav Item - Dashboard -->
      <li class="nav-item">
          <router-link to="/" class="nav-link">
              <i class="fas fa-fw fa-home"></i>
              <span>Home</span>
          </router-link>
      </li>

      <li class="nav-item">
          <router-link to="/docs" class="nav-link pad-0">
              <i class="fas fa-fw fa-info-circle"></i>
              <span>Docs</span>
          </router-link>
      </li>

      <li class="nav-item">
          <router-link to="/config" class="nav-link pad-0">
              <i class="fas fa-fw fa-cog"></i>
              <span>Config</span>
          </router-link>
      </li>

      <li class="nav-item">
          <router-link to="/projects" class="nav-link pad-0">
              <i class="fas fa-fw fa-folder"></i>
              <span>Projects</span>
          </router-link>
      </li>

      <!-- Divider -->
      <hr class="sidebar-divider">

      <!-- Heading -->
      <div class="sidebar-heading">
          Projects
      </div>

      <!-- Nav Item - Pages Collapse Menu -->
      <li class="nav-item">
          <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo"
              aria-expanded="true" aria-controls="collapseTwo">
              <i class="fas fa-fw fa-folder"></i>
              <span>Project Management</span>
          </a>
          <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
              <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">Available Projects:</h6>
                <router-link v-for="(project) in projects" :key="project" :to="'/projects/'+project.getName()" class="collapse-item" href="#">
                    {{ project.getName() }}
                </router-link>
              </div>
          </div>
      </li>

      <!-- Divider -->
      <hr class="sidebar-divider">

      <!-- Sidebar Toggler (Sidebar) -->
      <div class="text-center d-none d-md-inline">
          <button v-on:click="hideSidebar" class="rounded-circle border-0" id="sidebarToggle"></button>
      </div>
  </ul>
  <!-- End of Sidebar -->

  <!-- Content Wrapper -->
  <div id="content-wrapper" class="d-flex flex-column">

      <!-- Main Content -->
      <div id="content">

          <!-- Topbar -->
          <nav id="page-navbar" v-bind:style="{ display: configApp.getDisplayTopBar() }" class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

              <!-- Sidebar Toggle (Topbar) -->
              <button v-on:click="hideSidebar" id="sidebarToggleTop" class="btn btn-link rounded-circle d-md-none mr-3">
                  <i class="fa fa-bars"></i>
              </button>

              <!-- Topbar Search -->
              <div
                  class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                  <div class="input-group">
                      <input type="text" v-model="searchText" class="form-control bg-light border-0 small" placeholder="Search for...">
                      <div class="input-group-append">
                          <button v-on:click="search" class="btn btn-primary" type="button">
                              <i class="fas fa-search fa-sm"></i>
                          </button>
                      </div>
                  </div>
              </div>

              <!-- Topbar Navbar -->
              <ul class="navbar-nav ml-auto">

                  <!-- Nav Item - Search Dropdown (Visible Only XS) -->
                  <li class="nav-item dropdown no-arrow d-sm-none">
                      <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-search fa-fw"></i>
                      </a>
                      <!-- Dropdown - Messages -->
                      <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                          aria-labelledby="searchDropdown">
                          <div class="form-inline mr-auto w-100 navbar-search">
                              <div class="input-group">
                                  <input type="text" v-model="searchText" class="form-control bg-light border-0 small"
                                      placeholder="Search for...">
                                  <div class="input-group-append">
                                      <button v-on:click="search" class="btn btn-primary" type="button">
                                          <i class="fas fa-search fa-sm"></i>
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </li>

                  <!-- Nav Item - User Information -->
                  <li class="nav-item dropdown no-arrow">
                      <router-link to="/config" class="nav-link" id="userDropdown">
                          <span class="mr-2 d-none d-lg-inline text-gray-600 small">Admin</span>
                          <img class="img-profile rounded-circle" src="/img/undraw_profile.svg">
                      </router-link>
                  </li>
              </ul>

          </nav>
          <!-- End of Topbar -->

          <!-- Begin Page Content -->
          <div id="page-content" class="container-fluid mar20">

              <!-- Content Row -->
              <div class="row">
                  <div class="col-lg-12 mb-12">
                    <router-view></router-view>
                  </div>
              </div>

          </div>
          <!-- /.container-fluid -->

      </div>
      <!-- End of Main Content -->

      <!-- Footer -->
      <footer class="sticky-footer bg-white">
          <div class="container my-auto">
              <div class="copyright text-center my-auto">
                  <span>Copyright &copy; VariaMos.Com 2020 - Made in Medellin</span>
              </div>
          </div>
      </footer>
      <!-- End of Footer -->
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class App extends Vue {
    public $store:any; //references vuex store
    public projects:any = []; //references current projects (Project[])
    public configApp:any; //references current configApp (ConfigApp)
    public searchText:string = ""; //search text

    public beforeMount(){
        this.projects = this.$store.getters.initializeProjects; //initialize projects for the entire app
        this.configApp = this.$store.getters.initializeConfigApp; //initialize configApp for the entire app
    }

    public hideSidebar(){
        let body = document.querySelector('body');
        if(body){
            body.classList.toggle('sidebar-toggled');
        }

        let sidebar = document.querySelector('.sidebar');
        if(sidebar){
            sidebar.classList.toggle('toggled');
        }

        let mainIcon = document.querySelector('#main-icon');
        if(mainIcon){
            mainIcon.classList.toggle('display-icon-yes');
        }
    }

    public search(){
        //to be redefined in the child components
    }
}
</script>

<style>
@media (max-width: 768px){
    .display-icon {
        display: block !important;
    }
}

.display-icon {
    display: none;
}

.display-icon-yes {
    display: block !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.mar20{
    margin-top: 20px;
}

.pad-0 {
  padding-top: 0px !important;
}

a:hover{
    text-decoration: none !important;
}

.sidebar-brand-icon{
    font-size:25px;
}

/* begin tooltip */
.csstooltip .csstooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  font-size: 14px;
  position: absolute;
  z-index: 1;
  top: 100%;
  margin-top: 5px;
  left: 50%;
  opacity: 0;
  transition: opacity 1s;
}

.csstooltip:hover .csstooltiptext {
  visibility: visible;
  opacity: 1;
}

.csstooltip .csstooltiptext2 {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  font-size: 14px;
  position: absolute;
  z-index: 1;
  margin-left: -60px;
  margin-top: 30px;
  opacity: 0;
  transition: opacity 1s;
}

.csstooltip:hover .csstooltiptext2 {
  visibility: visible;
  opacity: 1;
}
/* end tooltip */

/* begin 404 */
.nopad404{
    padding: 0px !important;
    margin-top: 0px !important;
}

.nomarbo404{
    margin-bottom: 0px !important;
}
/* end 404 */
</style>