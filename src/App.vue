<template>
  <!-- Sidebar -->
  <ul class="navbar-nav bg-gradient-primary bg-dark-blue sidebar sidebar-dark accordion" id="accordionSidebar">

      <!-- Sidebar - Brand -->
      <router-link to="/">
      <a class="sidebar-brand d-flex align-items-center justify-content-center">
          <div id="main-icon" class="sidebar-brand-icon rotate-n-15 display-icon">
              V
           </div>
          <div class="sidebar-brand-text mx-3">VariaMos <sup>Basic</sup></div>
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
          <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

              <!-- Sidebar Toggle (Topbar) -->
              <button v-on:click="hideSidebar" id="sidebarToggleTop" class="btn btn-link rounded-circle d-md-none mr-3">
                  <i class="fa fa-bars"></i>
              </button>

              <!-- Topbar Search -->
              <form
                  class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                  <div class="input-group">
                      <input type="text" class="form-control bg-light border-0 small" placeholder="Search for..."
                          aria-label="Search" aria-describedby="basic-addon2">
                      <div class="input-group-append">
                          <button class="btn btn-primary" type="button">
                              <i class="fas fa-search fa-sm"></i>
                          </button>
                      </div>
                  </div>
              </form>

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
                          <form class="form-inline mr-auto w-100 navbar-search">
                              <div class="input-group">
                                  <input type="text" class="form-control bg-light border-0 small"
                                      placeholder="Search for..." aria-label="Search"
                                      aria-describedby="basic-addon2">
                                  <div class="input-group-append">
                                      <button class="btn btn-primary" type="button">
                                          <i class="fas fa-search fa-sm"></i>
                                      </button>
                                  </div>
                              </div>
                          </form>
                      </div>
                  </li>

                  <!-- Nav Item - User Information -->
                  <li class="nav-item dropdown no-arrow">
                      <a class="nav-link dropdown-toggle" href="#" id="userDropdown">
                          <span class="mr-2 d-none d-lg-inline text-gray-600 small">Admin</span>
                          <img class="img-profile rounded-circle" src="/img/undraw_profile.svg">
                      </a>
                  </li>
              </ul>

          </nav>
          <!-- End of Topbar -->

          <!-- Begin Page Content -->
          <div class="container-fluid">

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
                  <span>Copyright &copy; VariaMos.Com 2020</span>
              </div>
          </div>
      </footer>
      <!-- End of Footer -->
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Project as ProjectClass } from '@/store/Project';

export default class App extends Vue {
    public $store:any; //references vuex store
    public projects:any = [];//refences current projects (Project[])

    public mounted(){
        this.projects = this.$store.getters.initializeProjects;
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

.bg-dark-blue{
    background: navy;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
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
</style>