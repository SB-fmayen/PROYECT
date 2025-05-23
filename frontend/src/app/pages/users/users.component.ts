import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Necesario para *ngFor y pipes
import { FormsModule } from '@angular/forms'; // ✅ Necesario para ngModel
import { UsersService } from '../../services/user.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, // ✅ Agregado
    FormsModule   // ✅ Agregado
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
  usuarios: any[] = [];
  filtro = {
    name: '',
    email: '',
    roleId: '',
    isActive: '',
    createdFrom: '',
    createdTo: ''
  };

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    // ✅ Sanitiza el nombre (elimina tabs/espacios extras)
    this.filtro.name = this.filtro.name.replace(/\s+/g, ' ').trim();
    
    this.userService.getFilteredUsers(this.filtro).subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  filtrar(): void {
    this.obtenerUsuarios();
  }

  limpiarFiltros(): void {
    this.filtro = {
      name: '',
      email: '',
      roleId: '',
      isActive: '',
      createdFrom: '',
      createdTo: ''
    };
    this.filtrar();
  }
  exportarPDF(): void {
    const doc = new jsPDF({ orientation: 'landscape' });
    const headers = [['ID', 'Nombre', 'Email', 'Rol', 'Activo', 'Creado', 'Actualizado']];
    const data = this.usuarios.map((u) => [
      u.id,
      u.name,
      u.email,
      u.roleId,
      u.isActive ? 'Sí' : 'No',
      new Date(u.createdAt).toLocaleDateString(),
      new Date(u.updatedAt).toLocaleDateString()
    ]);

    doc.text('Listado de Usuarios', 15, 15);
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 20,
      theme: 'grid'
    });
    doc.save('usuarios.pdf');
  }

  exportarExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Usuarios');
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Rol', key: 'roleId', width: 10 },
      { header: 'Activo', key: 'isActive', width: 10 },
      { header: 'Creado', key: 'createdAt', width: 15 },
      { header: 'Actualizado', key: 'updatedAt', width: 15 }
    ];

    this.usuarios.forEach((user) => {
      worksheet.addRow({
        ...user,
        isActive: user.isActive ? 'Sí' : 'No',
        createdAt: new Date(user.createdAt).toLocaleDateString(),
        updatedAt: new Date(user.updatedAt).toLocaleDateString()
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'usuarios.xlsx');
    });
  }
}