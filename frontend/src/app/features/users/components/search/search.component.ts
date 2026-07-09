import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-search',
  imports: [MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {

}
