import '../style.css';
import './components/Search';

function themeDay() {
	const date = new Date(Date.now()).getHours();

	if (date < 8 || date > 18) document.body.classList.toggle('night');
	else document.body.classList.toggle('day');
}

themeDay();
