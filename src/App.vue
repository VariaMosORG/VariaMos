<template>
  <!-- Sidebar -->
  <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

      <!-- Sidebar - Brand -->
      <router-link to="/">
      <a class="sidebar-brand d-flex align-items-center justify-content-center">
          <div class="sidebar-brand-text mx-3">VariaMos <sup>Basic</sup></div>
      </a>
      </router-link>

      <!-- Divider -->
      <hr class="sidebar-divider my-0">

      <!-- Nav Item - Dashboard -->
      <li class="nav-item active">
          <router-link to="/">
          <a class="nav-link">
              <i class="fas fa-fw fa-tachometer-alt"></i>
              <span>Home</span></a>
          </router-link>
      </li>

      <li class="nav-item">
          <router-link to="/about">
          <a class="nav-link pad-0">
              <i class="fas fa-fw fa-tachometer-alt"></i>
              <span>About</span></a>
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
                  <a class="collapse-item" href="#">Project 1</a>
                  <a class="collapse-item" href="#">Project 2</a>
              </div>
          </div>
      </li>
  </ul>
  <!-- End of Sidebar -->

  <!-- Content Wrapper -->
  <div id="content-wrapper" class="d-flex flex-column">

      <!-- Main Content -->
      <div id="content">

          <!-- Topbar -->
          <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

              <!-- Sidebar Toggle (Topbar) -->
              <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
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
export default class App extends Vue {}
</script>

<style>
#app{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.pad-0{
  padding-top: 0px !important;
}
</style>
