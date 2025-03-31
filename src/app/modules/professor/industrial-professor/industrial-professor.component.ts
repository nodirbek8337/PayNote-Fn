import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-industrial-professor',
  standalone: true,
  templateUrl: './industrial-professor.component.html',
  styleUrl: './industrial-professor.component.scss',
  imports: [NgFor]
})
export class IndustrialProfessorComponent {
  professors = [
    {
      image: './assets/img/2.jpg',
      nameRole: 'Prof. Young Shin Kim',
      workYear: '2017 ~ Current',
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
    },
    {
      image: './assets/img/4.jpg',
      nameRole: 'Dr. John Doe',
      workYear: '2015 ~ Current',
      workMail: 'etxkang@khu.ac.kr',
      experiences: [
        { year: '2010 - present', title: 'Professor', description: 'MIT, USA' },
        { year: '2005 - 2010', title: 'Senior Lecturer', description: 'Stanford University, USA' },
        // ... boshqa tajribalari
      ]
    },
    {
      image: './assets/img/3.jpg',
      nameRole: 'Prof. Young Shin Kim',
      workYear: '2017 ~ Current',
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
    },
    {
      image: './assets/img/5.jpg',
      nameRole: 'Prof. Young Shin Kim',
      workYear: '2017 ~ Current',
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
