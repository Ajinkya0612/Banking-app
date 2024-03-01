import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { Account } from '../../types/account';
import { AccountCreationRequest } from '../../types/AccountCreationRequest';

@Component({
  selector: 'app-account-creation',
  templateUrl: './account-creation.component.html',
  styleUrls: ['./account-creation.component.css']
})
export class AccountCreationComponent implements OnInit {

  role!: String | null;
  userId!: Number;
  accountType!: String;
  accountForm: any = { AccountType: null }

  accountError$: Observable<string> = of();

  accountSuccess$: Observable<string> = of();

  isFormSubmitted: boolean = false;



  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private transactionService: TransactionService, 
    private router: Router
  ) {}


  ngOnInit(): void {

    this.role = this.authService.getRole();
    this.userId = this.authService.getUserId();

    if(this.role==="USER"){
      this.accountForm = this.formBuilder.group({
        accountType: ['', [Validators.required]],
        userId: [this.userId, Validators.required]
      });
    }
    

    else{
      this.accountForm = this.formBuilder.group({
        accountType: ['', [Validators.required]],
        userId: ["", Validators.required]
      })
  
    } 
    console.log(this.accountForm.value);
    
  }


  onSubmit() {

    this.isFormSubmitted = true;

    this.accountSuccess$ = of('');

    this.accountError$ = of('');

    if (this.accountForm.invalid) {

      return;

    } else {

      const data = this.accountForm.value;

      console.log(data);

      const account: AccountCreationRequest = new AccountCreationRequest(data);
      console.log(account);

      this.transactionService.addAccount(account).subscribe(

        (res: any) => {

          this.accountSuccess$ = of("Account created successfully");

        },

        () => {

          this.accountError$ = of("Unable to create account");

        }

      );

    }

  }

}
