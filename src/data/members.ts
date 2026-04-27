export interface Member {
  id: string;
  name: string;
  role: string;
  birthDate?: string;
  avatar?: string;
  parentId?: string; // Links to parent
  spouseId?: string; // Links to spouse
  gender: 'male' | 'female';
}

export const initialMembers: Member[] = [
  { id: '1', name: 'Nguyễn Văn A', role: 'Ông Nội', gender: 'male' },
  { id: '2', name: 'Trần Thị B', role: 'Bà Nội', gender: 'female', spouseId: '1' },
  { id: '3', name: 'Nguyễn Văn C', role: 'Cha', gender: 'male', parentId: '1' },
  { id: '4', name: 'Lê Thị D', role: 'Mẹ', gender: 'female', spouseId: '3' },
  { id: '5', name: 'Nguyễn Văn E', role: 'Con Cả', gender: 'male', parentId: '3' },
  { id: '6', name: 'Nguyễn Thị F', role: 'Con Thứ', gender: 'female', parentId: '3' },
  { id: '7', name: 'Phạm Văn G', role: 'Chú', gender: 'male', parentId: '1' },
  { id: '8', name: 'Vũ Thị H', role: 'Thím', gender: 'female', spouseId: '7' },
];
