import { Component } from '@angular/core';

@Component({
  selector: 'app-phd-candidate',
  standalone: false,
  templateUrl: './phd-candidate.component.html',
  styleUrl: './phd-candidate.component.scss'
})
export class PhdCandidateComponent {


  professors = [
    {
      image: './assets/img/1.jpg',
      nameRole: 'Prof.Young Shin Kim',
      Nationality: 'Pakistan',
      researchGroup: 'Cloud and Bigdata System',
        workMail: 'jake0011@gmail.com',
        desc: [
        'Dr Byeong Ho Kang, computer scientist, is a Professor in School of Engineering and ICT, University of Tasmania, Australia. He leads the Smart Services and Systems research group of postdoctoral scientists which has carried out fundamental and applied research in research areas, expert systems, Web Services, SNS analysis and smart industry areas. He has served as a chair and steering committee member in many international organizations and during conferences.' 
      ]
    },
    {
      image: './assets/img/3.jpg',
      nameRole: 'Prof.Young Shin Kim',
      Nationality: 'Pakistan',
      researchGroup: 'Cloud and Bigdata System',
        workMail: 'jake0011@gmail.com',
        desc: [
        'Dr Byeong Ho Kang, computer scientist, is a Professor in School of Engineering and ICT, University of Tasmania, Australia. He leads the Smart Services and Systems research group of postdoctoral scientists which has carried out fundamental and applied research in research areas, expert systems, Web Services, SNS analysis and smart industry areas. He has served as a chair and steering committee member in many international organizations and during conferences.' 
      ]
    },
  ]
}
