import {Component} from '@angular/core';

@Component({
    selector: 'supplemental-support',
    templateUrl: './supplemental-support.component.html',
    styleUrls: ['./supplemental.component.less']
})

export class SupplementalSupportComponent {
    public supportAvailable: boolean;

  ngOnInit() {
         //check if support is available 
        var currentDate = new Date();
        var currentDay = currentDate.getDay();
        this.supportAvailable = (currentDay > 0 && currentDay < 6) ? true : false;
        if (this.supportAvailable) {
            var currentTime = currentDate.getHours();

            var startSupportHours = new Date();
            startSupportHours.setHours(7, 30, 0); // 7:30 am
            var endSupportHours = new Date();
            endSupportHours.setHours(17, 30, 0); // 5.30 pm

            this.supportAvailable = (currentDate >= startSupportHours && currentDate <= endSupportHours) ? true : false;
        }
    }
}       
