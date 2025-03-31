import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-post-doc',
  standalone: true,
  templateUrl: './post-doc.component.html',
  styleUrl: './post-doc.component.scss',
  imports: [NgFor, RouterModule]
})
export class PostDocComponent {

  professors = [
    {
      image: './assets/img/1.jpg',
      nameRole: 'Prof.Young Shin Kim',
      Nationality: 'Vietnam',
      researchGroup: 'Cloud and Bigdata System',
      researchArea: 'Cloud Computing, Internet of Things, Machine Learning',
        workMail: 'jake0011@gmail.com',
        desc: [
        'Dr Byeong Ho Kang, computer scientist, is a Professor in School of Engineering and ICT, University of Tasmania, Australia. He leads the Smart Services and Systems research group of postdoctoral scientists which has carried out fundamental and applied research in research areas, expert systems, Web Services, SNS analysis and smart industry areas. He has served as a chair and steering committee member in many international organizations and during conferences.' 
      ]
    },
  ]



}
