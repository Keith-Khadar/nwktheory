import { Config, ConfigService } from './config.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  providers: [ ConfigService ],
  styles: ['.error { color: #b30000; }' ]
})
export class ConfigComponent {
  
  error: any;
  headers: string[] = [];
  config: Config | undefined;


  constructor(private configService: ConfigService){}
  
  clear(){
    this.config = undefined;
    this.error = undefined;
    this.headers = [];
  }

  showConfig(){
    this.configService.getConfig()
    // clone the data object, using its known Config shape
    .subscribe({
      next: (data: Config) => this.config = { ... data }, // sucess path
      error: error => this.error = error, // error path
    });
  }

  showConfigResponse() {
    this.configService.getConfigResponse()
    // resp is of type HttpResponse<Config>
    .subscribe(resp => {
      // display its headers
      const keys = resp.headers.keys();
      this.headers = keys.map(key =>
        `${key}: ${resp.headers.get(key)}`);

      // access the body directly, which is typed as Config
      this.config = {...resp.body! };
    });
  }

  makeError(){
    this.configService.makeIntentionalError().
    subscribe({ error: error => this.error = error.message });
  }

  getType(val: any): string {
    return val instanceof Date ? 'date' : Array.isArray(val) ? 'array' : typeof val;
  }
}
