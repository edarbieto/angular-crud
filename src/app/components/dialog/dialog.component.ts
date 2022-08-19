import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  freshnessOptions = ['Brand New', 'Second Hand', 'Refurbished'];
  productForm!: FormGroup;
  actionButton: string = 'Save';

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: [0, Validators.required],
      date: ['', Validators.required],
      comment: ['', Validators.required],
    });
    if (this.editData) {
      this.productForm.setValue(this.editData);
      this.actionButton = 'Update';
    }
  }

  addProduct(): void {
    if (this.productForm.valid) {
      if (!this.editData) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (_) => {
            alert('Product added successfully');
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error: (_) => {
            alert('Error while adding the Product');
          },
        });
      } else {
        console.log(this.productForm.value);
        this.api.patchProduct(this.productForm.value).subscribe({
          next: (_) => {
            alert('Product updated successfully');
            this.productForm.reset();
            this.dialogRef.close('update');
          },
          error: (_) => {
            alert('Error while updating the Product');
          },
        });
      }
    }
  }
}
