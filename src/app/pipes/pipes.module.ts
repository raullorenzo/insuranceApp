import { NgModule } from '@angular/core';
import { SearchPipe } from './search/search.pipe';
import { SortPipe } from './sort/sort.pipe';
import { TruncatePipe } from './truncate/truncate.pipe';

@NgModule({
    declarations: [
      TruncatePipe,
      SearchPipe,
      SortPipe
    ],
    imports: [],
    exports: [
      TruncatePipe,
      SearchPipe,
      SortPipe
    ]
})
export class PipesModule {}
