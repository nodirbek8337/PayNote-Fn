import { Component } from '@angular/core';

@Component({
  selector: 'app-visiting-professor',
  standalone: false,
  templateUrl: './visiting-professor.component.html',
  styleUrl: './visiting-professor.component.scss'
})
export class VisitingProfessorComponent {


  professors = [
    {
      image: './assets/img/1.jpg',
      area: 'Research Area :',
      Research: 'Expert System, Knowledge Maintenance, Live Knowledge.',
      nameRole: 'Prof.Young Shin Kim',
      workYear: '2017 ~ Current',
      Website: 'http://www.utas.edu.au/profiles/staff/ict/byeong-kang',
        workMail: 'jake0011@gmail.com',
        desc: [
        'Dr Byeong Ho Kang, computer scientist, is a Professor in School of Engineering and ICT, University of Tasmania, Australia. He leads the Smart Services and Systems research group of postdoctoral scientists which has carried out fundamental and applied research in research areas, expert systems, Web Services, SNS analysis and smart industry areas. He has served as a chair and steering committee member in many international organizations and during conferences.' 
      ]
    },
    {
      image: './assets/img/10.jpg',
      area: 'Research Area :',
      Research: 'Biomedical Engineering, Activity Recognition, Behaviour Modelling, Mobile based Reminding Solutions.',
      nameRole: 'Prof.Christopher Nugent',
      workYear: '2017 ~ Current',
      Website: 'https://www.ulster.ac.uk/staff/cd-nugent',
      workMail: 'jake0011@gmail.com',
      desc: [
        'Dr Byeong Ho Kang, computer scientist, is a Professor in School of Engineering and ICT, University of Tasmania, Australia. He leads the Smart Services and Systems research group of postdoctoral scientists which has carried out fundamental and applied research in research areas, expert systems, Web Services, SNS analysis and smart industry areas. He has served as a chair and steering committee member in many international organizations and during conferences.' 
      ]
    },
    {
      image: './assets/img/3.jpg',
      area: 'Research Area :',
      Research: 'Wearable, Ubiquitous and Mobile Computing Artificial Intelligence.',
      nameRole: 'Prof.Christopher Nugent',
      workYear: '2017 ~ Current',
      Website: 'http://orestibanos.com/',

      workMail: 'jake0011@gmail.com',
      desc: [
        'Dr Byeong Ho Kang, computer scientist, is a Professor in School of Engineering and ICT, University of Tasmania, Australia. He leads the Smart Services and Systems research group of postdoctoral scientists which has carried out fundamental and applied research in research areas, expert systems, Web Services, SNS analysis and smart industry areas. He has served as a chair and steering committee member in many international organizations and during conferences.' 
      ]
    },
    {
      image: './assets/img/6.jpg',
      area: 'Experience:',
      Research: 'Wearable, Ubiquitous and Mobile Computing Artificial Intelligence.',
      nameRole: 'Prof.Wajahat Ali Khan',
      workYear: '2017 ~ Current',
      Website: 'https://www.linkedin.com/in/anitasantanna',
      workMail: 'jake0011@gmail.com',
      experiences: [
        { year: '2017.08 - present', title: 'Industrial Professor', description: 'Kyung Hee University, Korea' },
        { year: '2015.10 - 2017.07', title: 'CEO', description: 'Cosbiomatics, Korea' },
        { year: '2012.03 – 2015.02', title: 'Head of Department', description: 'Kyung Hee University, Korea' },
        { year: '2006.01 - 2008.12', title: 'Director', description: 'Cosbiomatics, Korea' },
        { year: '2000.03 - 2005.12', title: 'Head of Department', description: 'Kyung Hee University, Korea' },
        { year: '1995.05 - 2000.02', title: 'Head of Department', description: 'Cosbiomatics, Korea' },
        { year: '1995.05 - 2000.02', title: 'Lecturer', description: 'Cosbiomatics, Korea' },
      ]
    }
    
    // Yana boshqa insonlar
  ];
}
