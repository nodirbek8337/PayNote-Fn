import { Component } from '@angular/core';

@Component({
  selector: 'app-post-doc',
  standalone: false,
  templateUrl: './post-doc.component.html',
  styleUrl: './post-doc.component.scss'
})
export class PostDocComponent {




  professor = {
    image: './assets/img/1.jpg',
    nameRole: 'Prof.Sungyoung Lee',
    position: 'Director of Ubiquitous Computing Laboratory',
    department: 'Department of Computer Science and Engineering,  College of Software',
    university: 'Kyung Hee University, Korea',
    universityUrl: 'http://www.kyunghee.edu',
    researchAreas: [
      'Ubiquitous Computing',
      'Context-aware Middleware',
      'Wireless Sensor Network',
      'Security Systems',
      'Real-time Embedded Systems',
      'Distributed Systems',
      'Intelligent Computing'
    ],
    contact: {
      address: `446-701, Room 313, Dept. of Computer Engineering,
      Kyung Hee University, Seocheon-dong, Giheung-gu,
      Yongin-si, Gyeonggi-do, Korea`,
      email: 'sylee@oslab.khu.ac.kr',
      office: '+82-31-201-2514 (Phone), +82-31-202-2520 (Fax)',
      cell: '+82-10-7345-1441'
    }
  };
}
