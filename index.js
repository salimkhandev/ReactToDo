// const notes = ["Note1", "Note2", "Note3"];
// const search = "Note2";
// const showCompleted = true;
// const completedNotes = [false, true, true];

// const filtered = notes
//   .map((note, index) => ({ note, index }))
//   .filter(({ note, index }) => {
//     if (showCompleted) {
//       return (
//         completedNotes[index] &&
//         note.toLowerCase().includes(search.toLowerCase())
//       );
//     }
//     return note.toLowerCase().includes(search.toLowerCase());
//   });

// console.log(filtered);
// // [ { note: 'Note2', index: 1 } ]
  const notes = ['First Note', 'Second Note', 'Third Note'];
const mappedNotes = notes.map((note, index) => ({ note, index }));

console.log(mappedNotes); 
// [
//   { note: 'First Note', index: 0 },
//   { note: 'Second Note', index: 1 },
//   { note: 'Third Note', index: 2 }
// ]
