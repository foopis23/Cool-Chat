import { Pipe, PipeTransform } from '@angular/core';
import { UserQueryService } from '../services/user-query.service';
import { Status } from '../types/User';

@Pipe({
  name: 'userStatus'
})
export class UserStatusPipe implements PipeTransform {
  constructor(private usrSvc : UserQueryService) {}

  transform(status : Status): string {
    return this.usrSvc.statusToString(status);
  }

}
