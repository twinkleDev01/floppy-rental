export interface Blog {
  categoryName: string;
  tittle: string;
    description: string;
    keywords: string;
    menuId: number;
    tempDateTime: string | null;
    dateTimeTempNo: number;
    pDescription: string | null;
    userId: number | null;
    compId: number;
    yearId: number | null;
    branchId: number | null;
    image: string;
    author: string
  }

  export interface BlogReview {
    name: string;
    comment: string;
    }
  