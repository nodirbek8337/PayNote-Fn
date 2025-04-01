import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { title } from 'process';

@Component({
  selector: 'app-professor',
  standalone: true,
  templateUrl: './professor.component.html',
  styleUrl: './professor.component.scss',
  imports: [NgFor, RouterModule],
})
export class ProfessorComponent {
  professor = {
    image: './assets/img/1.jpg',
    nameRole: 'Prof.Sungyoung Lee',
    position: 'Director of Ubiquitous Computing Laboratory',
    department:
      'Department of Computer Science and Engineering,  College of Software',
    university: 'Kyung Hee University, Korea',
    universityUrl: 'http://www.kyunghee.edu',
    researchAreas: [
      'Ubiquitous Computing',
      'Context-aware Middleware',
      'Wireless Sensor Network',
      'Security Systems',
      'Real-time Embedded Systems',
      'Distributed Systems',
      'Intelligent Computing',
    ],
    contact: {
      address: `446-701, Room 313, Dept. of Computer Engineering,
      Kyung Hee University, Seocheon-dong, Giheung-gu,
      Yongin-si, Gyeonggi-do, Korea`,
      email: 'sylee@oslab.khu.ac.kr',
      office: '+82-31-201-2514 (Phone), +82-31-202-2520 (Fax)',
      cell: '+82-10-7345-1441',
    },
    title:[
      {
        year:'Year',
        university: 'University',
        major: 'Major',
        degree:'Degree',
        career:'career',
        awardTitle: 'Award Title'
      }

    ],

    EducationalInformations: [
      {
        year: '1974.3 - 1978.2',
        university: 'Korea University',
        major: 'Material Science',
        degree: 'Bachelor',
      },
      {
        year: '1984.8 - 1985.12',
        university: 'Fairleigh Dickinson University, New Jersey, U.S.A.',
        major: 'Computer Science',
        degree: 'Master',
      },
      {
        year: '1986.1 - 1987.12',
        university: '	Illinois Institute of Technology(IIT), Chicago, Illinois, U.S.A.',
        major: 'Computer Science',
        degree: 'Master',
      },
      {
        year: '1987.12 - 1991.12',
        university: '	Illinois Institute of Technology(IIT), Chicago, Illinois, U.S.A.',
        major: 'Computer Science',
        degree: 'Ph.D',
      },
    ],
    CareerInformations:[
      {
        year: '1990.9 - 1992.8',
        career: 'Full-Time Lecturer',
        universuty: "Dept. of Computer Science, Governors State University, University Park, Illinois, U.S.A.",
      },
      {
        year: '1992.9 - 1993.8',
        career: 'Assistant Professor',
        universuty: " Dept. of Computer Science, Governors State University, University Park, Illinois, U.S.A.",
      },
      {
        year: '1993.9 - 1996.9',
        career: 'Assistant Professor',
        universuty: "Dept. of Computer Engineering, College of Eletronics and Information, Kyung Hee University, Korea",
      },
      {
        year: '1996.10 - 2001.9',
        career: 'Associate Professor',
        universuty: "Dept. of Computer Engineering, College of Eletronics and Information, Kyung Hee University, Korea",
      },
      {
        year: '2001.10 - Current',
        career: 'Professor',
        universuty: "Dept. of Computer Engineering, College of Eletronics and Information, Kyung Hee University, Korea",
      },
    ],
    Awards: [
      {
        year: '2016',
        title: 'Kyung Hee Fellow'
      },
      {
        year: '2015',
        title: 'Korean Institute of Information Scientists and Engineers (KIISE) Gaheon Academic Award'
      },
      {
        year: '2006',
        title: 'Korea Information Processing Society (KIPS) Academic Award'
      },
    ]
  };
}
