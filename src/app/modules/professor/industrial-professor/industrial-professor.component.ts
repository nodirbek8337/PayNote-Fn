import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-industrial-professor',
  standalone: false,
  templateUrl: './industrial-professor.component.html',
  styleUrl: './industrial-professor.component.scss'
})
export class IndustrialProfessorComponent {
[x: string]: any;
  @Input() year!: [number] | [number, string];
  @Input() title!: string;
  @Input() description!: string;
  Experience = [
    {year: '2017.08 - present', title:'Industrial Professor', description: 'Dept. of Computer Engineering, College of Eletronics and Information, Kyung Hee University, Korea'},
    {year: '2015.10 - 2017.07', title:'CEO', description: '	Cosbiomatics, Korea'},
    {year: '2012.03 – 2015.02', title:'Head of Department', description: 'Youngin Severance Hospital Office of Foreign Cooperation, Korea'},
    {year: '2006.01 - 2008.12', title:'Director', description: 'Digital Industry Promotion Agency of Youngin City , Korea'},
    {year: '2000.03 - 2005.12', title:'Head of Department', description: 'National IT Industry Promotion Agency (NIPA), Korea'},
    {year: '1995.05 - 2000.02', title:'Head of Department', description: 'National Information Society Agency (NIA), Korea'},
    {year: '1995.05 - 2000.02', title:'Lecturer', description: 'IBM Korea'},
  ];

  professor = {
    image: './assets/img/2.jpg',
    nameRole: 'Prof.Young shin kim',


  };
}
