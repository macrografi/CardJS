import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement, Title } from 'chart.js';
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

Chart.register(
  TreemapController,
  TreemapElement,
  CategoryScale,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  resizeObservable$: Observable<Event> | any;
  resizeSubscription$: Subscription | any;
  private myChart: any;
  myData: [] | any;
  destroyButton = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnDestroy(): void {
    this.destroyButton = true;
    this.myChart.destroy();
  }

  ngAfterViewInit(): void {
    this.renderCard();
  }

  ngOnInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((event$: any) => {
      this.calculateCanvas();
    });
  }

  // Font Form
  fontFromRaw = (ctx: any): any => {
    const value = ctx.raw.w / 7;
    return { lineHeight: 'auto', size: value };
  };

  // Color Form
  colorFromRaw = (ctx: any, color: any): any => {
    if (ctx.type !== 'data') {
      return 'transparent';
    }
    const value = ctx.raw.v;
    const alpha = Math.log(value) / 5;
    return `rgba(${color}, ${alpha})`;
  };

  // Calculate Chart Form
  calculateCanvas(): void {
    const myElem = document.getElementById('myDiv') as HTMLElement;

    setTimeout(() => {
      for (const id in Chart.instances) {
        let myInstance = Chart.instances[id].height;
        myInstance = myElem.clientHeight;

        Chart.instances[id].resize();
      }
    }, 300);
  }

  // Destroy Chart
  destroyCard(): void {
    this.destroyButton = true;
    this.myChart.destroy();
  }

  // Render Chart
  renderCard(): void {
    this.destroyButton = false;
    setTimeout(() => {
      this.myData = [
        { login: 1500000, amount: 100000, ratio: 10 },
        { login: 1500001, amount: 99999, ratio: 20 },
        { login: 1500002, amount: 99998, ratio: 30 },
        { login: 1500003, amount: 99997, ratio: 40 },
        { login: 1500004, amount: 99996, ratio: 50 },
        { login: 1500005, amount: 99995, ratio: 60 },
        { login: 1500006, amount: 99994, ratio: 70 },
        { login: 1500007, amount: 99993, ratio: 80 },
      ];
      const depositChartData = {
        datasets: [
          {
            label: 'Deposit',
            key: 'ratio',
            tree: this.myData,
            labels: {
              display: true,
              formatter(ctx: any): any {
                //console.log(ctx.raw._data);
                const login = ctx.raw._data.login;
                const amount = ctx.raw._data.amount;
                const ratio = ctx.raw._data.ratio;

                const myVal = login + '|' + amount + ' USD' + '|' + '%' + ratio;
                return myVal.split('|', 4);
                //return ratio + '%' + amount + login;
              },
              color: 'black',
              font: (ctx: any) => this.fontFromRaw(ctx),
              /*            hoverFont: {
            size: 30,
            weight: 'bold',
          },*/
            },
            backgroundColor: (ctx: any) => this.colorFromRaw(ctx, '198,220,199'),
            fontColor: '#000',
            fontFamily: 'serif',
            fontSize: 12,
            fontStyle: 'normal',
            data: [],
          },
        ],
      };
      this.myChart = new Chart('depositChart', {
        type: 'treemap',
        data: depositChartData,
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false,
              text: 'Deposit',
            },
            legend: {
              display: false,
            },
          },
        },
      });
    }, 300);
    this.calculateCanvas();
  }

  // Add Chart
  addItem(): void {
    let random = (max: number) => {
      return Math.floor(Math.random() * max);
    };
    const myRandom = random(40);
    this.myData.push({ login: 20 + myRandom, amount: 10 + myRandom, ratio: 10 });
    this.myChart.update('active');
  }

  // Form
  cardForm = this.formBuilder.group({
    index: ['', [Validators.min(1), Validators.required]],
    login: ['', [Validators.min(1), Validators.required]],
    amount: ['', [Validators.min(1), Validators.required]],
    ratio: ['', [Validators.min(1), Validators.max(100), Validators.required]],
  });

  onSubmit(): void {
    const myArray = this.myChart.data.datasets[0].data;
    let myIndex = this.cardForm.value.index;
    let myLogin = this.cardForm.value.login;
    let myAmount = this.cardForm.value.amount;
    let myRatio = this.cardForm.value.ratio;

    for (let i = 0; i < myArray.length; i++) {
      myArray[myIndex]._data.login = myLogin;
      myArray[myIndex]._data.amount = myAmount;
      myArray[myIndex]._data.ratio = myRatio;
      this.myChart.update('active');
    }
  }
}
