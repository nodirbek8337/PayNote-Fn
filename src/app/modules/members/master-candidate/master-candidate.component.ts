import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-master-candidate',
  standalone: true,
  templateUrl: './master-candidate.component.html',
  styleUrl: './master-candidate.component.scss',
  imports: [NgFor]
})
export class MasterCandidateComponent {

  professors = [
    {
      image: './assets/img/9.jpg',
      nameRole: 'Bold Chinguun - 1st',
      Nationality: 'Ecuador',
      researchGroup: 'Cloud and Bigdata System',
        workMail: 'jake0011@gmail.com',
        desc: [
        'Dr Byeong Ho Kang, computer scientist, is a Professor in School of Engineering and ICT, University of Tasmania, Australia. He leads the Smart Services and Systems research group of postdoctoral scientists which has carried out fundamental and applied research in research areas, expert systems, Web Services, SNS analysis and smart industry areas. He has served as a chair and steering committee member in many international organizations and during conferences.' 
      ]
    },
  ]
}
