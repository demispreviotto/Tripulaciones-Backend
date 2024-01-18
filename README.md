<h1 align="center">Desafío de Tripulaciones Backend</h1>

## About the project

This project consists on generating an app/web to solve an specific problem, the huge work an administrator of buildings have. The day to day of the administrator is receiving a lot of messages/emails that notify him the incidences a building have. An administrator of buildings in Spain has on average 50 buildings to administrate. Taking into account this number the work of him/her is very vig so we simplified his life. In Fincup, the administrator have a detail of his buildings, incidences that he has to manage and can see the owners of the doors, and the service they have available on the app. In incidences, the administrator can have a follow-up of them and can see the status of the incidence to keep sure is being processed of is pending, etc.

## Summary of the project

We generated endpoints for various aspects.

In all the controllers the logged user can create buildings, doors, incidences, owners, services, todos, users. as well as update what he want, delete, and get all or only one getting it by his id. The user can log in, log out or if his not user he can register. In the register we encrypted the password for making it more secure and private.

The models were created taking into account different aspects, such as the address in Builings and the CRU that is the id of the building in spain, in Owners we thinked about the email, phone, etc. Users have email, password and more rows.

We connected our DataBase with out team of Data Scientists, due to this, we received a JSON file in which incidences, buildings, owners and more were created and we connected the JSON and generated enpoints to received the information and create that info to our DataBase.

## Technologies used in the project

<p align="center">
  <!--MONGODB-->
  <a href="https://www.mongodb.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/mongodb-original-wordmark.svg" alt="MongoDB" width="40" height="50"/></a>
  <!--NODEJS-->
  <a href="https://nodejs.org/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/nodejs-original-wordmark.svg" alt="Node.js" width="40" height="50" /></a>  
  <!--EXPRESSJS-->
  <a href="https://expressjs.com/" target="_blank"><img style="margin: 10px" src="https://images.ctfassets.net/f8prwnjrws8j/6faOqoRn6Rmx97PKSXbtdg/0534d1228feeb99a72361cb66ac2327d/expressjs.png" alt="Express.js" width="100" height="50" /></a>
  <!--JAVASCRIPT-->
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="40" height="50" alt="JavaScript">
  <!--NPM-->
  <img src="https://imgs.search.brave.com/ziXbll6Eu_vanLF_3jITiNkpTCtx7YcJeFlLoeAvjIA/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9naXRs/YWIuc3ZnLnpvbmUv/b21uaWFpdC9kZXZl/bG9wZXItbG9nb3Mv/cmF3L21hc3Rlci9s/b2dvcy9mcm9udC1l/bmQtd2ViL25wbS5z/dmc.svg" width="40" height="50">
  <!--FL0-->
  <img src="https://imgs.search.brave.com/DhrAuUihnTuZo3_9y78hrhjO1ZgBWnRL7do65jYxLj4/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMtZ2xvYmFsLndl/YnNpdGUtZmlsZXMu/Y29tLzYxMGIyN2U3/ZDQ1YmRhM2MzOWRl/YmM3ZS82NDQ0ODVk/NmI3ZGQ3MDRmYjMw/OWEyNjhfbG9nby1i/aWdnZXIuc3Zn.svg" width="40" height="50">
</p>

### Licence

This project is under licence of Nicolás Blanco Zappalá & Demis Previotto

### Contact

- Nicolás Blanco Zappalá
  <a href = "mailto:nblancozappala@gmail.com"><img src="https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a>
  <a href="https://www.linkedin.com/in/nblancoz/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
  <a href="https://github.com/nblancoz" target="_blank"><img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" target="_blank"></a>

- Demis Previotto
  <a href = "mailto:demis.previotto@gmail.com"><img src="https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a>
  <a href="https://www.linkedin.com/in/demispreviotto/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
  <a href="https://github.com/demispreviotto" target="_blank"><img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" target="_blank"></a>
