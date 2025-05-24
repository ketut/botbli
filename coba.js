import bcrypt from 'bcryptjs';
console.log(bcrypt.compareSync('samuraiX', '$2a$10$5Pq0JxpcoXhbVkiYN9G.v.y/7E7ndMyiKdC6HbllXrxgSI67hCyyG')); // true if correct