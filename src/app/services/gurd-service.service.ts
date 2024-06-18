import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GurdServiceService {

  constructor() { }
  gettoken(){  
    return !!localStorage.getItem("Info");  
    } 
}
