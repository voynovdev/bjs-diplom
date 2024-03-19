// Обработка выхода из личного кабинета
const logoutButton = new LogoutButton();
logoutButton.action = function() {
	ApiConnector.logout((response) => {
		if (response.success) {
			location.reload();
		}
	});
};

// Обработка данных для вывода пользователю в личный кабинет
ApiConnector.current((response) => {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	}
});

// Обработка данных курса валют и обновление их каждые 60 сек.
const ratesBoard = new RatesBoard();

function fetchRates() {
	ApiConnector.getStocks((response) => {
		if (response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data)
		}
	})
};
fetchRates();
setInterval(fetchRates, 60000);

// Обработка пополнения баланса
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = data => {
	ApiConnector.addMoney(data, (response) => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, "Счет пополнен");
		} else if (data.amount <= 0) {
			moneyManager.setMessage(response.success, "Некорректное значение суммы")
		}
	})
}

// Обработка конвертации валюты
moneyManager.conversionMoneyCallback = data => {
	ApiConnector.convertMoney(data, (response) => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, "Успешно");
		} else if (data.amount <= 0) {
			moneyManager.setMessage(response.success, "Некорректное значение суммы")
		} else {
			moneyManager.setMessage(response.success, "Некорректное значение суммы")
		}
	})
}

// Обработка перечисления валюты
moneyManager.sendMoneyCallback = data => {
	ApiConnector.transferMoney(data, (response) => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, "Успешно");
		} else if (data.amount <= 0) {
			moneyManager.setMessage(response.success, "Некорректное значение суммы")
		} else {
			moneyManager.setMessage(response.success, "Некорректное значение суммы")
		}
	})
}

// Обработка обновления списка избранных
const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites((response) => {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data)
	}
})

// Обработка добавления пользователя
favoritesWidget.addUserCallback = data => {
	ApiConnector.addUserToFavorites(data, (response) => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data)
			favoritesWidget.setMessage(response.success, "Пользователь добавлен")
		} else {
			favoritesWidget.setMessage(response.success, "Данные введены неккоректно")
		}
	})
}

// Обработка удаления пользователя
favoritesWidget.removeUserCallback = (data) => {
	ApiConnector.removeUserFromFavorites(data, (response) => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data)
			favoritesWidget.setMessage(response.success, "Пользователь удален")
		}
	})
}