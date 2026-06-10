// Inside debugTools.js

export function triggerScoringTest(gameBoard) {
    console.log("--- DEBUG TEST INITIATED ---");
    
    // Clear the board
    gameBoard.clearAllCards();

    // Add your test cards
    gameBoard.addCard({ type: "TypeA" });
    gameBoard.addCard({ type: "Hare" });
    gameBoard.addCard({ type: "Hare" });
    gameBoard.addCard({ type: "Common Toad" });
    gameBoard.addCard({ type: "Common Toad" });
    gameBoard.addCard({ type: "Common Toad" });

    console.log("Test Board Loaded. Ready to score!");
}