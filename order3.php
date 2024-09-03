<?php
// Ensure proper session handling at the start of the PHP file
session_start();

// Database credentials (assuming these are defined in 'connections.php')
require_once('connections.php');

try {
    // Create a new PDO instance
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    die();
}

function calculateStatus($dateOrdered, $currentDate) {
    $dateOrdered = new DateTime($dateOrdered);
    $currentDate = new DateTime($currentDate);
    $interval = $dateOrdered->diff($currentDate)->days;

    if ($interval <= 15) {
        return "Order is being processed";
    } elseif ($interval <= 30) {
        return "Order Confirmed";
    } else {
        return "Order delivered";
    }
}

try {
    // Create the table if it doesn't exist
    $createTableQuery = "
    CREATE TABLE IF NOT EXISTS orders_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chickType VARCHAR(255),
        name VARCHAR(255),
        mobile VARCHAR(255),
        age VARCHAR(255),
        quantity INT,
        fee DECIMAL(10, 2),
        paid DECIMAL(10, 2),
        balance DECIMAL(10, 2),
        dateOrdered DATE,
        deliveryDate DATE
    )";
    $conn->exec($createTableQuery);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['order_id']) && !empty($_POST['order_id'])) {
            // Update order
            $order_id = $_POST['order_id'];
            $chickType = $_POST['chickType'];
            $name = $_POST['name'];
            $mobile = $_POST['mobile'];
            $age = $_POST['age'];
            $quantity = $_POST['quantity'];
            $fee = $_POST['fee'];
            $paid = $_POST['paid'];
            $balance = $fee - $paid;
            $dateOrdered = $_POST['dateOrdered'];
            $deliveryDate = $_POST['deliveryDate'];
            
            $updateQuery = "
            UPDATE orders_table 
            SET dateOrdered = :dateOrdered, chickType = :chickType, name = :name, mobile = :mobile, age = :age, quantity = :quantity, fee = :fee, paid = :paid, balance = :balance, deliveryDate = :deliveryDate 
            WHERE id = :id";
            
            $stmt = $conn->prepare($updateQuery);
            $stmt->bindParam(':dateOrdered', $dateOrdered);
            $stmt->bindParam(':chickType', $chickType);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':mobile', $mobile);
            $stmt->bindParam(':age', $age);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->bindParam(':fee', $fee);
            $stmt->bindParam(':paid', $paid);
            $stmt->bindParam(':balance', $balance);
            $stmt->bindParam(':deliveryDate', $deliveryDate);
            $stmt->bindParam(':id', $order_id);
            $stmt->execute();
            
            $_SESSION['message'] = "Order updated successfully!";
        } elseif (isset($_POST['submit'])) {
            // Insert new order
            $chickType = $_POST['chickType'];
            $name = $_POST['name'];
            $mobile = $_POST['mobile'];
            $age = $_POST['age'];
            $quantity = $_POST['quantity'];
            $fee = $_POST['fee'];
            $paid = $_POST['paid'];
            $balance = $fee - $paid;
            $dateOrdered = $_POST['dateOrdered'];
            $deliveryDate = $_POST['deliveryDate'];

            $insertQuery = "
            INSERT INTO orders_table (chickType, name, mobile, age, quantity, fee, paid, balance, dateOrdered, deliveryDate)
            VALUES (:chickType, :name, :mobile, :age, :quantity, :fee, :paid, :balance, :dateOrdered, :deliveryDate)";
            
            $stmt = $conn->prepare($insertQuery);
            $stmt->bindParam(':chickType', $chickType);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':mobile', $mobile);
            $stmt->bindParam(':age', $age);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->bindParam(':fee', $fee);
            $stmt->bindParam(':paid', $paid);
            $stmt->bindParam(':balance', $balance);
            $stmt->bindParam(':dateOrdered', $dateOrdered);
            $stmt->bindParam(':deliveryDate', $deliveryDate);
            $stmt->execute();
            
            $_SESSION['message'] = "Order created successfully!";
        } elseif (isset($_POST['delete_id'])) {
            // Delete record
            $delete_id = $_POST['delete_id'];
            $deleteQuery = "DELETE FROM orders_table WHERE id = :id";
            $stmt = $conn->prepare($deleteQuery);
            $stmt->bindParam(':id', $delete_id);
            $stmt->execute();
            
            $_SESSION['message'] = "Order deleted successfully!";
            // No need to echo here, as the deletion message should be shown after redirection
        }
        
        header("Location: " . $_SERVER['REQUEST_URI']);
        exit();
    }
} catch (PDOException $e) {
    $_SESSION['message'] = "Error: " . $e->getMessage();
}

// Get current date
$currentDate = date('Y-m-d');

// Initialize records array
$records = [];

// Query to get all records
$sql = "SELECT * FROM orders_table";
$result = $conn->query($sql);
if ($result) {
    $records = $result->fetchAll(PDO::FETCH_ASSOC);
    foreach ($records as &$record) {
        $record['status'] = calculateStatus($record['dateOrdered'], $currentDate);
    }
    unset($record); // Break the reference with the last element
} else {
    $_SESSION['message'] = "Error: " . $conn->error;
}

// Calculate total quantity and balance
$totalQty = array_sum(array_column($records, 'quantity'));
$totalBalance = array_sum(array_column($records, 'balance'));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Form</title>
    <!--<link rel="stylesheet" href="styles.css">-->
    <style>
     /* Reset and General Styles */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
}

.container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #1f8dd6;
    color: #fff;
}

.logo img {
    max-width: 100px;
}

.nav ul {
    list-style-type: none;
    display: flex;
}

.nav ul li {
    margin-right: 20px;
}

.nav ul li a {
    color: #fff;
    text-decoration: none;
    font-weight: bold;
}

.nav ul li a.active,
.nav ul li a:hover {
    text-decoration: underline;
}

.title {
    margin-bottom: 20px;
    color: #1f8dd6;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input[type=text],
input[type=number],
select,
input[type=date] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

.btn-group {
    margin-top: 20px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.submit-btn {
    background-color: #1f8dd6;
    color: #fff;
}

.reset-btn {
    background-color: #ccc;
    color: #000;
    margin-left: 10px;
}

.edit-btn,
.delete-btn {
    background-color: #f44336;
    color: #fff;
    margin-right: 10px;
}

.edit-btn:hover,
.delete-btn:hover {
    background-color: #d32f2f;
}
a img(
border-radius:50%;
)
.records {
    margin-top: 30px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

table, th, td {
    border: 1px solid #ddd;
}

th, td {
    padding: 10px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.totals {
    background-color: #f2f2f2;
    font-weight: bold;
}

@media (max-width: 768px) {
    .nav ul {
        flex-direction: column;
        align-items: center;
    }

    .nav ul li {
        margin-bottom: 10px;
    }
}
   
    </style>
</head>
<body>
<div class="header">
    <div class="logo">
        <a href="#"><img src="img/logo.png" alt="Zekmos Farms Logo" class="logo"></a>
    </div>
    <nav class="nav">
        <ul>
            <li><a href="nn.php">Hatchery</a></li>
            <!--<li><a href="egg-records.php">Egg Records</a></li>-->
            <!--<li><a href="search_page.php">Customers</a></li>-->
            <!--<li><a href="search.php">Find Client</a></li>-->
            <li><a href="order.php" class="active">Orders</a></li>
            <li><a href="logout.php" class="logout">Logout</a></li>
        </ul>
    </nav>
</div>

<div class="container">
    <h1 class="title">Make Order</h1>
    <form id="orderForm" action="order.php" method="post">
        <input type="hidden" id="order_id" name="order_id">
        <div class="form-group">
            <label for="dateOrdered">Date Ordered:</label>
            <input type="date" id="dateOrdered" name="dateOrdered" required>
        </div>
        <div class="form-group">
            <label for="chickType">Type of Chick:</label>
            <select id="chickType" name="chickType" required>
                <option value="">Select Chick Type</option>
                <option value="guinea fowl">Guinea Fowl</option>
                <option value="fowl">Local Fowl</option>
                <option value="duck">Duckling</option>
                <option value="turkey">Turkey</option>
                <option value="quail">Quails</option>
            </select>
        </div>
        <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
            <label for="mobile">Mobile Number:</label>
            <input type="text" id="mobile" name="mobile" required>
        </div>
        <div class="form-group">
            <label for="age">Age:</label>
            <select id="age" name="age" required>
                <option value="Day old">Day old</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="3 weeks">3 weeks</option>
                <option value="4 weeks">4 weeks</option>
            </select>
        </div>
        <div class="form-group">
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" required>
        </div>
        <div class="form-group">
            <label for="fee">Fee:</label>
            <input type="text" id="fee" name="fee" required>
        </div>
        <div class="form-group">
            <label for="paid">Amount Paid:</label>
            <input type="text" id="paid" name="paid" required>
        </div>
        <div class="form-group">
            <label for="balance">Balance:</label>
            <input type="text" id="balance" name="balance" readonly>
        </div>
        <div class="form-group">
            <label for="deliveryDate">Delivery Date:</label>
            <input type="date" id="deliveryDate" name="deliveryDate" required>
        </div>
        <div class="btn-group">
            <button type="submit" name="submit" class="btn submit-btn">Submit Order</button>
            <button type="reset" class="btn reset-btn">Reset</button>
        </div>
    </form>

    <div class="records">
        <h2>Orders</h2>
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Type of Chick</th>
                    <th>Name</th>
                    <th>Mobile Number</th>
                    <th>Age</th>
                    <th>Quantity</th>
                    <th>Fee</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Date Ordered</th>
                    <th>Delivery Date</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <!-- PHP loop for order records -->
                <?php foreach ($records as $record): ?>
                    <tr>
                        <td><?php echo $record['id']; ?></td>
                        <td><?php echo $record['chickType']; ?></td>
                        <td><?php echo $record['name']; ?></td>
                        <td><?php echo $record['mobile']; ?></td>
                        <td><?php echo $record['age']; ?></td>
                        <td><?php echo $record['quantity']; ?></td>
                        <td><?php echo $record['fee']; ?></td>
                        <td><?php echo $record['paid']; ?></td>
                        <td><?php echo $record['balance']; ?></td>
                        <td><?php echo $record['dateOrdered']; ?></td>
                        <td><?php echo $record['deliveryDate']; ?></td>
                        <td><?php echo $record['status']; ?></td>
                        <td>
                            <form method="post" action="order.php">
                                <input type="hidden" name="delete_id" value="<?php echo $record['id']; ?>">
                                <button type="submit" class="btn delete-btn" onclick="return confirm('Are you sure you want to delete this order?')">Delete</button>
                            </form>
                            <button class="btn edit-btn" onclick="editOrder(<?php echo $record['id']; ?>)">Edit</button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<script>
    // JavaScript for editing an order
    function editOrder(id) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "edit_order.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                var order = JSON.parse(this.responseText);
                document.getElementById('order_id').value = order.id;
                document.getElementById('dateOrdered').value = order.dateOrdered;
                document.getElementById('chickType').value = order.chickType;
                document.getElementById('name').value = order.name;
                document.getElementById('mobile').value = order.mobile;
                document.getElementById('age').value = order.age;
                document.getElementById('quantity').value = order.quantity;
                document.getElementById('fee').value = order.fee;
                document.getElementById('paid').value = order.paid;
                document.getElementById('balance').value = order.balance;
                document.getElementById('deliveryDate').value = order.deliveryDate;
            }
        };
        xhr.send("order_id=" + id);
    }

    // Calculate balance based on fee and paid amount
    document.getElementById('paid').addEventListener('input', function() {
        var fee = parseFloat(document.getElementById('fee').value);
        var paid = parseFloat(document.getElementById('paid').value);
        var balance = fee - paid;
        document.getElementById('balance').value = balance.toFixed(2);
    });
</script>
</body>
</html>

</body>
</html>
