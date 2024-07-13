<?php
session_start();

// Database credentials
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

try {
    // Create the table if it doesn't exist
    $createTableQuery = "
    CREATE TABLE IF NOT EXISTS hatchappp (
        id INT AUTO_INCREMENT PRIMARY KEY,
        eggType VARCHAR(255),
        source VARCHAR(255),
        mobile VARCHAR(255),
        tray INT,
        quantity INT,
        fee DECIMAL(10, 2),
        paid DECIMAL(10, 2),
        balance DECIMAL(10, 2),
        dateLoaded DATE,
        lockdownDate DATE
    )";
    $conn->exec($createTableQuery);

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit'])) {
        $eggType = $_POST['eggType'];
        $source = $_POST['source'];
        $mobile = $_POST['mobile'];
        $tray = $_POST['tray'];
        $quantity = $_POST['quantity'];
        $fee = $quantity * 1; // Calculate fee based on quantity
        $paid = $_POST['paid'];
        $balance = $fee - $paid;
        $dateLoaded = $_POST['dateLoaded'];
        
        // Calculate lockdown date based on egg type
        switch (strtolower($eggType)) {
            case 'guinea fowl':
                $lockdownPeriod = 21;
                break;
            case 'fowl':
                $lockdownPeriod = 18;
                break;
            case 'duck':
            case 'turkey':
                $lockdownPeriod = 25;
                break;
            case 'quail':
                $lockdownPeriod = 14;
                break;
            default:
                $lockdownPeriod = 0;
                break; // Handle unknown types gracefully
        }

        // Calculate lockdown date
        if ($lockdownPeriod > 0) {
            $dateLoadedObj = new DateTime($dateLoaded);
            $lockdownDateObj = clone $dateLoadedObj;
            $lockdownDateObj->add(new DateInterval("P{$lockdownPeriod}D"));
            $lockdownDate = $lockdownDateObj->format('Y-m-d');
        } else {
            $lockdownDate = null; // Handle unknown types gracefully
        }

        // Prepare and execute SQL insert statement
        $insertQuery = "
        INSERT INTO hatchappp (eggType, source, mobile, tray, quantity, fee, paid, balance, dateLoaded, lockdownDate)
        VALUES (:eggType, :source, :mobile, :tray, :quantity, :fee, :paid, :balance, :dateLoaded, :lockdownDate)";

        $stmt = $conn->prepare($insertQuery);
        $stmt->bindParam(':eggType', $eggType);
        $stmt->bindParam(':source', $source);
        $stmt->bindParam(':mobile', $mobile);
        $stmt->bindParam(':tray', $tray);
        $stmt->bindParam(':quantity', $quantity);
        $stmt->bindParam(':fee', $fee);
        $stmt->bindParam(':paid', $paid);
        $stmt->bindParam(':balance', $balance);
        $stmt->bindParam(':dateLoaded', $dateLoaded);
        $stmt->bindParam(':lockdownDate', $lockdownDate);
        $stmt->execute();

        $_SESSION['success_message'] = "Record added successfully.";
        header("Location: " . $_SERVER['REQUEST_URI']);
        exit();
    } elseif (isset($_POST['delete_id'])) {
        // Delete record
        $delete_id = $_POST['delete_id'];
        $deleteQuery = "DELETE FROM hatchappp WHERE id = :id";
        $stmt = $conn->prepare($deleteQuery);
        $stmt->bindParam(':id', $delete_id);
        $stmt->execute();
        $_SESSION['success_message'] = "Record deleted successfully.";
        header("Location: " . $_SERVER['REQUEST_URI']);
        exit();
    }
} catch (Exception $e) {
    $_SESSION['error_message'] = "Error: " . $e->getMessage();
    header("Location: " . $_SERVER['REQUEST_URI']);
    exit();
}

// Define the calculateStatus function
function calculateStatus($eggType, $dateLoaded, $currentDate) {
    $dateLoaded = new DateTime($dateLoaded);
    $currentDate = new DateTime($currentDate);
    $daysDiff = $currentDate->diff($dateLoaded)->days;

    switch (strtolower($eggType)) {
        case 'guinea fowl':
            $lockdownPeriod = 24;
            break;
        case 'fowl':
            $lockdownPeriod = 18;
            break;
        case 'duck':
        case 'turkey':
            $lockdownPeriod = 24;
            break;
        case 'quail':
            $lockdownPeriod = 14;
            break;
        default:
            return 'Unknown egg type';
    }

    if ($daysDiff <= $lockdownPeriod - 3) {
        return 'Incubating';
    } elseif ($daysDiff > $lockdownPeriod - 3 && $daysDiff <= $lockdownPeriod - 1) {
        return 'PrepareForLockdown';
    }elseif ($daysDiff > $lockdownPeriod - 3 && $daysDiff <= $lockdownPeriod + 2) {
        return 'Hatching';
    }
    
    else {
        return 'Hatched';
    }
}

// Get current date
$currentDate = date('Y-m-d');

// Initialize records array
$records = [];

// Query to get all records
$sql = "SELECT * FROM hatchappp";
$result = $conn->query($sql);
if ($result) {
    $records = $result->fetchAll(PDO::FETCH_ASSOC);
    foreach ($records as &$record) {
        $record['status'] = calculateStatus($record['eggType'], $record['dateLoaded'], $currentDate);
    }
    unset($record); // Break the reference with the last element
} else {
    echo "Error: " . $conn->error;
}

// Calculate total quantity, balance, and payments
$totalQty = array_sum(array_column($records, 'quantity'));
$totalBalance = array_sum(array_column($records, 'balance'));
$totalPayments = array_sum(array_column($records, 'paid'));
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="content-type" content="text/html/php; charset=utf-8" />
    <link rel="shortcut icon" href="img/chick.png">
    <meta property="zekmosfarms.org" content="Zekmos hatchapp" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hatch App</title>
    <style>
        /* General Styles */
        body {
            width: 90vw;
            font-family: 'Arial', sans-serif;
            margin: 0 15px;
            padding: 5px;
            background: #f4f7f6;
            color: #333;
            justify-content: center;
            height:100%;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            margin: auto;
            padding: 10px;
        }

        /* Header */
        .header {
            background: #3d3d3d;
            color: #fff;
            padding: 10px 0;
            text-align: center;
        }

        .header .logo1 img {
            width: 150px;
            height: auto;
            border-radius: 48%;
        }

        .nav-links {
            display: flex;
            justify-content: center;
            padding: 8px 0;
        }

        .nav-links .btn {
            margin: 0 10px;
            padding: 10px 15px;
            background: #5c6bc0;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s;
        }

        .nav-links .btn:hover {
            background: #3949ab;
        }

        /* Form Styles */
        form {
            background: #fff;
            padding: 8px;
            margin: 10px 0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }

        form label {
            display: block;
            margin: 10px 0;
            font-weight: bold;
        }

        form input[type="text"],
        form input[type="number"],
        form input[type="date"] {
            width: calc(100% - 20px);
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }

        form input[type="submit"] {
            background: #4caf50;
            color: white;
            padding: 2px 5px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        }

        select {
            width: calc(100% - 20px);
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }

        form input[type="submit"]:hover {
            background: #45a049;
        }

        /* Table Styles */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }

        th {
            background-color: #4CAF50;
            color: white;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        /* Footer Styles */
        .footer {
            background: #3d3d3d;
            color: white;
            text-align: center;
            padding: 10px 0;
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
        }

        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Zekmo's Hatch App</h1>
         <header class="header">
        <div class="logo1" style="text-align:center;">
            <a class="link" href="/www.zekmosfarms.org"><img src="img/logo.png" class="logo" /></a>
        </div>
        <div class="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
        </div>
            <nav class="nav-links">
            <a href="nn.php" class="btn active ">Hatcher</a>
            <!--<a href="egg-records.php" class="btn ">Egg Records</a>-->
            <!--<a href="search_page.php" class="btn ">Customers</a>-->
            <!--<a href="search.php" class="btn">Find Client</a>-->
            <a href="order.php" class="btn ">Orders</a>
            <!-- <a href="view-orders.php" class="btn">View Orders</a> -->
             <a href="logout.php" class="btn logout"> logout</a></div>
            </nav>
        </header>
           <?php
        // Display success or error messages if set
        if (isset($_SESSION['success_message'])) {
            echo '<div class="success-message">' . $_SESSION['success_message'] . '</div>';
            unset($_SESSION['success_message']);
        } elseif (isset($_SESSION['error_message'])) {
            echo '<div class="error-message">' . $_SESSION['error_message'] . '</div>';
            unset($_SESSION['error_message']);
        }
        ?>
       
        <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="POST">
             <label for="dateLoaded">Set Date:</label>
            <input type="date" id="dateLoaded" name="dateLoaded" required>
            <label for="eggType">Egg Type:</label>
            <select name="eggType" id="eggType" required>
                <option value="" disabled selected>Select egg type</option>
                <option value="Guinea fowl">Guinea fowl</option>
                <option value="Fowl">Fowl</option>
                <option value="Duck">Duck</option>
                <option value="Turkeys">Turkeys</option>
                <option value="Quail">Quail</option>
            </select>
            <label for="source">Customer Name:</label>
            <input type="text" id="source" name="source" required>
            <label for="mobile">Mobile:</label>
            <input type="text" id="mobile" name="mobile" required>
            <label for="tray">Tray Number:</label>
            <input type="number" id="tray" name="tray" required>
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" required>
            <label for="paid">Amount Paid:</label>
            <input type="number" id="paid" name="paid" required>
           
            <input type="submit" name="submit" value="Submit">
        </form>
        <table>
            <thead>
                <tr>
                    <th>Egg Type</th>
                    <th>Source</th>
                    <th>Mobile</th>
                    <th>Tray</th>
                    <th>Quantity</th>
                    <th>Fee</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Date Loaded</th>
                    <th>Lockdown Date</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($records as $record): ?>
                    <tr>
                        <td><?php echo $record['eggType']; ?></td>
                        <td><?php echo $record['source']; ?></td>
                        <td><?php echo $record['mobile']; ?></td>
                        <td><?php echo $record['tray']; ?></td>
                        <td><?php echo $record['quantity']; ?></td>
                        <td><?php echo '¢' . number_format($record['fee'], 2); ?></td>
                        <td><?php echo '¢' . number_format($record['paid'], 2); ?></td>
                        <td><?php echo '¢' . number_format($record['balance'], 2); ?></td>
                        <td><?php echo date('d-M-Y', strtotime($record['dateLoaded'])); ?></td>
                        <td><?php echo $record['lockdownDate'] ? date('d-M-Y', strtotime($record['lockdownDate'])) : ''; ?></td>
                        <td><?php echo $record['status']; ?></td>
                         <td>
                            <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
                                <input type="hidden" name="delete_id" value="<?php echo $record['id']; ?>">
                                <button type="submit" onclick="return confirm('Are you sure you want to delete this record?')">Delete</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
                <?php if (empty($records)): ?>
                    <tr>
                        <td colspan="12" style="text-align: center;">No records found.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="4">Totals:</th>
                    <th><?php echo $totalQty; ?></th>
                    <th><?php echo '¢' . number_format(array_sum(array_column($records, 'fee')), 2); ?></th>
                    <th><?php echo '¢' . number_format($totalPayments, 2); ?></th>
                    <th><?php echo '¢' . number_format($totalBalance, 2); ?></th>
                    <th colspan="4"></th>
                </tr>
            </tfoot>
        </table>
      
    </div>
    <div style="margin-top:25px; padding:6px;">
         <footer class="footer">
            <p>&copy; <?php echo date('Y'); ?> Zekmo's Hatch App</p>
        </footer>
    </div>
</body>
</html>
