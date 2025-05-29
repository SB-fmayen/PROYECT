import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsersService, CreateUserDTO, User } from '../../services/user.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  usuarios: User[] = [];
  roles: { id: number; nombre: string }[] = [];
  filtro = { name: '', email: '', roleId: '', isActive: '', createdFrom: '', createdTo: '' };

  // Filtro desplegable
  showFilter = false;

  // Modales
  @ViewChild('editModal')   editModal!: TemplateRef<any>;
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;
  private modalRef!: NgbModalRef;
  editUser!: User;
  deleteUser!: User;

  constructor(private userService: UsersService, private modal: NgbModal) {}

  ngOnInit(): void {
    this.cargarRoles();
    this.obtenerUsuarios();
  }

  cargarRoles(): void {
    this.userService.getRoles().subscribe({
      next: data => this.roles = data,
      error: err => console.error('Error roles:', err)
    });
  }

  obtenerUsuarios(): void {
    this.userService.getFilteredUsers(this.filtro).subscribe({
      next: data => this.usuarios = data,
      error: err => console.error('Error usuarios:', err)
    });
  }

  // Filtros
  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  filtrar(): void {
    this.obtenerUsuarios();
  }

  aplicarFiltros(): void {
    this.filtrar();
    this.showFilter = false;
  }

  limpiarFiltros(): void {
    this.filtro = { name:'', email:'', roleId:'', isActive:'', createdFrom:'', createdTo:'' };
    this.filtrar();
    this.showFilter = false;
  }

  // Exportar PDF
  exportarPDF(): void {
    const doc = new jsPDF({ orientation: 'landscape' });
    const headers = [['ID','Nombre','Correo','Rol','Activo','Creado','Actualizado']];
    const body = this.usuarios.map(u => [
      u.id.toString(),
      u.nombre,
      u.correo,
      u.rol,
      u.activo ? 'Sí' : 'No',
      new Date(u.creadoEn).toLocaleDateString(),
      new Date(u.actualizadoEn).toLocaleDateString()
    ]);
    doc.text('Listado de Usuarios', 15, 15);
    autoTable(doc, { head: headers, body, startY: 20, theme: 'grid' });
    doc.save('usuarios.pdf');
  }

  // Exportar Excel
  exportarExcel(): void {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Usuarios');
    ws.columns = [
      { header: 'ID',            key: 'id',           width: 10 },
      { header: 'Nombre',        key: 'nombre',       width: 25 },
      { header: 'Correo',        key: 'correo',       width: 30 },
      { header: 'Rol',           key: 'rol',          width: 15 },
      { header: 'Activo',        key: 'activo',       width: 10 },
      { header: 'Creado',        key: 'creadoEn',     width: 15 },
      { header: 'Actualizado',   key: 'actualizadoEn',width: 15 }
    ];
    this.usuarios.forEach(u => {
      ws.addRow({
        id: u.id,
        nombre: u.nombre,
        correo: u.correo,
        rol: u.rol,
        activo: u.activo ? 'Sí' : 'No',
        creadoEn: new Date(u.creadoEn).toLocaleDateString(),
        actualizadoEn: new Date(u.actualizadoEn).toLocaleDateString()
      });
    });
    wb.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      FileSaver.saveAs(blob, 'usuarios.xlsx');
    });
  }

  abrirEditModal(u: User): void {
    this.editUser = { ...u };
    this.modalRef = this.modal.open(this.editModal, { size: 'lg' });
  }

  guardarEdicion(form: NgForm): void {
    if (form.invalid) return;
    const payload: CreateUserDTO = {
      nombre: this.editUser.nombre,
      correo: this.editUser.correo,
      rolId:   Number(this.editUser.rol),
      activo:  this.editUser.activo
    };
    this.userService.updateUser(this.editUser.id, payload).subscribe({
      next: () => {
        this.modalRef.close();
        this.obtenerUsuarios();
      },
      error: err => console.error('Error editar usuario:', err)
    });
  }

  abrirDeleteModal(u: User): void {
    this.deleteUser = u;
    this.modalRef = this.modal.open(this.deleteModal, { size: 'md' });
  }

  confirmarBorrado(): void {
    this.userService.deleteUser(this.deleteUser.id).subscribe({
      next: () => {
        this.modalRef.close();
        this.obtenerUsuarios();
      },
      error: err => console.error('Error borrar usuario:', err)
    });
  }
}
