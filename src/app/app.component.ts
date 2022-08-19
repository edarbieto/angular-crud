import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'angular-crud';
  displayedColumns: string[] = [
    'id',
    'name',
    'category',
    'freshness',
    'price',
    'date',
    'comment',
    'actions',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sort.sortChange.subscribe(() => this.paginator.firstPage());
  }

  openDialog(): void {
    this.dialog
      .open(DialogComponent, {
        minWidth: '30%',
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'save') {
          this.getAllProducts();
        }
      });
  }

  getAllProducts(): void {
    this.api.getProducts().subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
      error: (_) => {
        alert('Error while fetching the Products');
      },
    });
  }

  editProduct(row: any): void {
    this.dialog
      .open(DialogComponent, {
        minWidth: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'update') {
          this.getAllProducts();
        }
      });
  }

  deleteProduct(row: any): void {
    this.api.deleteProduct(row).subscribe({
      next: (_) => {
        alert('Product deleted successfully');
        this.getAllProducts();
      },
      error: (_) => {
        alert('Error while deleting the Product');
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
