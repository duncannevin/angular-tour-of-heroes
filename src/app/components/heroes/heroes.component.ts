import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'

import { Hero } from '../../entities/hero'
import { HeroService } from '../../services/hero.service'

@Component({
  selector: 'app-heroes', // components css element selector
  templateUrl: './heroes.component.html', // location of the template file
  styleUrls: ['./heroes.component.sass'] // location of private style sheets
})
export class HeroesComponent implements OnInit {

  heroes: Hero[]

  newHero = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl('')
  })

  constructor(
    private heroService: HeroService
  ) { }

  ngOnInit() {
    this.getHeroes()
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes)
  }

  add(): void {
    const name: string = Object.values(this.newHero.value).join(' ')
    this.newHero.reset()
    if (!name) return
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => this.heroes.push(hero))
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero)
    this.heroService.deleteHero(hero).subscribe()
  }
}
