import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'

import { Hero } from '../../entities/hero'
import { HeroService } from '../../services/hero.service'

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.sass']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]> // the $ is convention indicating this is an observable
  private searchTerms = new Subject<string>()

  constructor(
    private heroService: HeroService
  ) { }

  search(term: string): void {
    this.searchTerms.next(term)
  }

  ngOnInit() {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as pervious term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term))
    )
  }
}