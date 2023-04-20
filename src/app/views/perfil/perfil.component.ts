import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Perfil } from './perfil.interface';
import { Repo } from './repo.interface';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  username = '';
  perfil?: Perfil;
  repos?: Repo[];
  searchBoxControl = new FormControl();
  notFound = false;
  now = Date.now();
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(item => {
    this.username = item['username'];

    const user = this.httpClient.get(`https://api.github.com/users/${this.username}`);
    const repos = this.httpClient.get(`https://api.github.com/users/${this.username}/repos`);
      if (this.username) {
        forkJoin([user, repos]).subscribe(i => {
          this.perfil = i[0] as Perfil;
          const reposToSort = i[1] as Repo[];
          this.repos = reposToSort.sort((a,b) => b.stargazers_count - a.stargazers_count);
        });
      }

  });
  }

  search() {
    this.username = this.searchBoxControl.value;
    
    const user = this.httpClient.get(`https://api.github.com/users/${this.username}`);
    const repos = this.httpClient.get(`https://api.github.com/users/${this.username}/repos`);
    if (this.username) {
      forkJoin([user, repos]).subscribe(i => {
        this.perfil = i[0] as Perfil;
        const reposToSort = i[1] as Repo[];
        this.repos = reposToSort.sort((a,b) => b.stargazers_count - a.stargazers_count);
        console.log(this.repos)
      });
    }
  }

  
  lastUpdated(repo: Repo) {
    if (!repo.updated_at) return
    let days = Math.trunc((this.now - new Date(repo.updated_at).getTime()) / (1000 * 3600 * 24));
    return `atualizado há ${days} dia${days > 1 ? 's' : ''}`; 
  }

  getProfileImage(): string | null {
    if (this.perfil && !this.perfil.avatar_url) return 'assets/blank-profile-picture.png';
    else if(this.perfil && this.perfil.avatar_url) return this.perfil.avatar_url;
    else return null;
  }
}
