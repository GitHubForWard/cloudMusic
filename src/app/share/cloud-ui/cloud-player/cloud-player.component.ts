import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cloud-player',
  templateUrl: './cloud-player.component.html',
  styleUrls: ['./cloud-player.component.less']
})
export class CloudPlayerComponent implements OnInit {

  constructor() { }

  onPercentChange(per: number) {
    console.log(per);
  }

  ngOnInit() {
  }

}
