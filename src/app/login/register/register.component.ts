import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private authSvc: AuthService) { }

  ngOnInit(): void {
    this.authSvc.authState$.subscribe((authState) => {
      console.log({ authState })
    })
  }

  public async onClick() {
    console.log("registering...")
    
    // hard coded test...
    let cred = await this.authSvc.register("foopis23@gmail.com", "test123", "foopis23");

    console.log({ cred });
  }
}
