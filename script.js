"use strict";

// Data
const account1 = {
	owner: "Jonas Schmedtmann",
	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
	interestRate: 1.2, // %
	pin: 1111,
};

const account2 = {
	owner: "Jessica Davis",
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,
};

const account3 = {
	owner: "Steven Thomas Williams",
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
};

const account4 = {
	owner: "Sarah Smith",
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Functions

// Inside this function containerMovements.innerHTML = "": This line clears the HTML
// content of the div with class movements (we have 2 entries there by default inside HTML file).

// The next line creates a new array movs which is a copy of movements sorted in ascending order
// if sort is true, otherwise it remains the same as movements.

// Next we have a loop that iterates over each movement in movs variable.

// Inside the loop, it determines the type of movement (deposit or withdrawal) based on whether
// the value is positive or negative.

// Then it generates HTML code for each movement row, including the movement type and value.

// Finally, it inserts the generated HTML code at the beginning of the containerMovements element.

const displayMovements = function (movements, sort = false) {
	containerMovements.innerHTML = "";

	const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

	movs.forEach(function (mov, i) {
		const type = mov > 0 ? "deposit" : "withdrawal";

		const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
			i + 1
		} ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

		containerMovements.insertAdjacentHTML("afterbegin", html);
	});
};

// First line uses the reduce method to sum up all the movements in the acc.movements array.
// It starts with an initial value of 0 and iterates through each movement, adding its value
// to the accumulator (acc).

// Last line updates the text content of the labelBalance element to display the calculated
// balance with the Euro symbol.

const calcDisplayBalance = function (acc) {
	acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
	labelBalance.textContent = `${acc.balance}€`;
};

// First variable called incomes stored all the movements which are first filtered to be greater
// than 0, and later we calculate the sum of them. At the end, we change it inside DOM.

// The second one variables stores basically the same, but we filtered all the values to be
// less than 0. The rest is the same.

// The last block calculates the total interest earned. It filters out positive movements (deposits),
// then maps each deposit to its corresponding interest amount based on the account's interest rate.
// It filters out interests less than 1 Euro, then sums up the remaining interests using the reduce method.

// Finally, the last line updates the text content of the labelSumInterest element to display the calculated
// total interest earned with the Euro symbol.

const calcDisplaySummary = function (acc) {
	const incomes = acc.movements
		.filter((mov) => mov > 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumIn.textContent = `${incomes}€`;

	const out = acc.movements
		.filter((mov) => mov < 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumOut.textContent = `${Math.abs(out)}€`;

	const interest = acc.movements
		.filter((mov) => mov > 0)
		.map((deposit) => (deposit * acc.interestRate) / 100)
		.filter((int, i, arr) => {
			// console.log(arr);
			return int >= 1;
		})
		.reduce((acc, int) => acc + int, 0);
	labelSumInterest.textContent = `${interest}€`;
};

// This loop iterates over each account object in the accs array.

// This line assigns a username to each account object. It does so by taking the owner property of
// the account, converting it to lowercase, splitting it into an array of words, then mapping each
// word to its first character. Finally, it joins these characters together to form the username.

const createUsernames = function (accs) {
	accs.forEach(function (acc) {
		acc.username = acc.owner
			.toLowerCase()
			.split(" ")
			.map((name) => name[0])
			.join("");
	});
};

// We execute our code here.

createUsernames(accounts);

// In below function we accept one parameter which will be an object. Later we execute all three
// previous functions, and for the first one we can't just use acc, but instead we need to use
// acc.movements because in every other function we use always acc.movement command except the first
// one.

const updateUI = function (acc) {
	// Display movements
	displayMovements(acc.movements);

	// Display balance
	calcDisplayBalance(acc);

	// Display summary
	calcDisplaySummary(acc);
};

// Event handlers

let currentAccount;

// This line prevents the default behavior of form submission when the button is clicked. This is
// often done in login forms to prevent the page from refreshing.

// This line searches for an account in the accounts array whose username matches the value entered
// in the inputLoginUsername field. It assigns the found account object to the currentAccount variable.

// This line checks if the pin property of the currentAccount object matches the value entered in the
// inputLoginPin field. The ?. is the optional chaining operator, used here to prevent an error in case
// currentAccount is undefined. If the pin matches, the following actions are executed:

// 1. Updates the text content of labelWelcome to greet the user with their first name.
// 2. Sets the opacity of the containerApp element to 100, making it visible.
// 3 Clears the input fields inputLoginUsername and inputLoginPin.
// 4. Blurs the focus from the inputLoginPin field.
// 5. Calls the updateUI function with the currentAccount to update the user interface.

btnLogin.addEventListener("click", function (e) {
	// Prevent form from submitting
	e.preventDefault();

	currentAccount = accounts.find(
		(acc) => acc.username === inputLoginUsername.value
	);

	if (currentAccount?.pin === Number(inputLoginPin.value)) {
		// Display UI and message
		labelWelcome.textContent = `Welcome back, ${
			currentAccount.owner.split(" ")[0]
		}`;
		containerApp.style.opacity = 100; // in JS there is 0 or 100, in CSS 0 or 1

		// Clear input fields
		inputLoginUsername.value = inputLoginPin.value = "";
		inputLoginPin.blur();

		// Update UI
		updateUI(currentAccount);
	}
});

// This line retrieves the value entered in the inputTransferAmount field and converts it to a number.

// This line searches for an account in the accounts array whose username matches the value entered in
// the inputTransferTo field. It assigns the found account object to the receiverAcc variable.

// This line clears the input fields inputTransferAmount and inputTransferTo.

// This conditional statement checks if the transfer is valid:

// 1. It checks if the amount is greater than 0, ensuring a valid transfer amount.
// 2. It checks if a receiverAcc was found (i.e., the entered username corresponds to an existing account).
// 3. It checks if the currentAccount has sufficient balance for the transfer.
// 4. It ensures that the receiverAcc is not the same as the currentAccount.

// If all conditions are met, the transfer is executed:

// 1. The amount is deducted from the currentAccount's movements with a negative value (indicating a withdrawal).
// 2. The amount is added to the receiverAcc's movements.

// Finally, the UI is updated by calling the updateUI function with the currentAccount.

btnTransfer.addEventListener("click", function (e) {
	e.preventDefault();

	const amount = Number(inputTransferAmount.value);

	const receiverAcc = accounts.find(
		(acc) => acc.username === inputTransferTo.value
	);

	inputTransferAmount.value = inputTransferTo.value = "";

	if (
		amount > 0 &&
		receiverAcc &&
		currentAccount.balance >= amount &&
		receiverAcc?.username !== currentAccount.username
	) {
		// Doing the transfer
		currentAccount.movements.push(-amount);
		receiverAcc.movements.push(amount);

		// Update UI
		updateUI(currentAccount);
	}
});

// This line retrieves the value entered in the inputLoanAmount field and converts it to a number.

// This conditional statement checks if the loan request is valid:

// 1. It checks if the amount is greater than 0, ensuring a valid loan amount.
// 2. It uses the some method on currentAccount.movements to check if there is at least one movement
// (transaction) where the amount is greater than or equal to 10% of the requested loan amount (amount * 0.1).
// This condition ensures that the account has had a recent transaction of at least 10% of the requested loan amount.

// If the conditions are met, the loan is granted:

// 1. The amount is added to currentAccount.movements to represent the loan.

// Finally, the UI is updated by calling the updateUI function with the currentAccount. The inputLoanAmount field is cleared.

btnLoan.addEventListener("click", function (e) {
	e.preventDefault();

	const amount = Number(inputLoanAmount.value);

	if (
		amount > 0 &&
		currentAccount.movements.some((mov) => mov >= amount * 0.1)
	) {
		// Add movement
		currentAccount.movements.push(amount);

		// Update UI
		updateUI(currentAccount);
	}
	inputLoanAmount.value = "";
});

// This conditional statement checks if the provided username and pin match the current account's credentials:

// 1. It checks if the value entered in the inputCloseUsername field matches the username of the currentAccount.
// 2. It checks if the value entered in the inputClosePin field matches the pin of the currentAccount.

// If both conditions are met, the account is closed:

// 1. The index of the currentAccount in the accounts array is found using the findIndex method.
// 2. The splice method is used to remove the currentAccount from the accounts array.
// 3. The UI is hidden by setting the opacity of the containerApp element to 0.

// The inputCloseUsername and inputClosePin fields are cleared.

btnClose.addEventListener("click", function (e) {
	e.preventDefault();

	if (
		inputCloseUsername.value === currentAccount.username &&
		Number(inputClosePin.value) === currentAccount.pin
	) {
		const index = accounts.findIndex(
			(acc) => acc.username === currentAccount.username
		);

		// Delete account
		accounts.splice(index, 1);

		// Hide UI
		containerApp.style.opacity = 0;
	}

	inputCloseUsername.value = inputClosePin.value = "";
});

// This line calls the displayMovements function with two arguments:

// 1. currentAccount.movements: The movements array of the current account.
// 2. !sorted: The sorting parameter is negated (sorted is initially false, so !sorted is true).
// This parameter determines whether the movements should be sorted or not. If sorted is false, the movements
//  are sorted, if sorted is true, the movements are not sorted.

// The last line toggles the value of the sorted variable. If it was false, it becomes true, and vice versa.
// This ensures that each time the button is clicked, the sorting behavior toggles between sorting and not sorting.

let sorted = false;

btnSort.addEventListener("click", function (e) {
	e.preventDefault();

	displayMovements(currentAccount.movements, !sorted);
	sorted = !sorted;
});
